/* eslint-disable no-unused-vars */
import GSAP from 'gsap';
// 
import Prefix from 'prefix';

import each from 'lodash/each';
import map from 'lodash/map';
import NormalizeWheel from 'normalize-wheel'
import Title from 'animations/Title';
import Paragraph from 'animations/Paragraph';
import Label from 'animations/Label';
import Highlight from 'animations/Highlight';

import AsyncLoad from 'classes/AsyncLoad';

import { ColorsManager } from 'classes/Color';

export default class Page {
  constructor({ element, elements, id }) {
    this.selector = element;
    this.selectorChildren = {
      ...elements,

      animationsHighlights: '[data-animation="highlight"]',
      animationsTitles: '[data-animation="title"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',

      preloaders: '[data-src]',
    };

    this.id = id;

    this.transformPrefix = Prefix('transform');

    

  }

  create() {
    this.element = document.querySelector(this.selector);
    this.elements = {};

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,
    };

    this.y = {
      start: 0,
      distance: 0,
      end: 0,
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
  };

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList ||
        Array.isArray(entry)
      ) {
        this.elements[key] = entry;
      } else {
        this.elements[key] = document.querySelectorAll(entry);

        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry);
        }
      }
    });

    this.createAnimations();

    this.createPreloader();
  }

  createPreloader() {
    this.preloaders = map(this.elements.preloaders, (element) => {
      return new AsyncLoad({ element });
    });
  }

  // Animations

  createAnimations() {
    this.animations = [];

    // Titles

    this.animationsTitles = map(this.elements.animationsTitles, (element) => {
      return new Title({
        element,
      });
    });

    this.animations.push(...this.animationsTitles);

    // Paragraphs

    this.animationsParagraphs = map(
      this.elements.animationsParagraphs,
      (element) => {
        return new Paragraph({
          element,
        });
      }
    );

    this.animations.push(...this.animationsParagraphs);

    // Labels

    this.animationsLabels = map(this.elements.animationsLabels, (element) => {
      return new Label({
        element,
      });
    });

    this.animations.push(...this.animationsLabels);

    // Highlights

    this.animationsHighlights = map(
      this.elements.animationsHighlights,
      (element) => {
        return new Highlight({
          element,
        });
      }
    );

    this.animations.push(...this.animationsHighlights);
  }

  show(animation) {
    return new Promise((resolve) => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color'),
      });

      if (animation) {
        this.animationIn = animation;
      } else {
        this.animationIn = GSAP.timeline();
        this.animationIn.fromTo(
          this.element,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
          }
        );
      }

      this.animationIn.call((_) => {
        this.addEventListeners();

        resolve();
      });
    });
  }

  hide() {
    return new Promise((resolve) => {
      this.destroy();

      this.animationIn = GSAP.timeline();

      this.animationIn.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve,
      });
    });
  }

  // Events

  onResize() {
    if (this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight;
    }

    each(this.animations, (animation) => animation.onResize());
  }

  
    onTouchDown(e) {
      this.isDown = true
      // this.speed.target = 1
      this.y.start = e.touches ? e.touches[0].clientY : e.clientY;
    }
  
  onTouchMove(e) {
    if (!this.isDown) return
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    this.y.end = y;
    
    
    const Distance = - this.y.start + this.y.end;
    this.scroll.target =  (-Distance) + (this.scroll.last/8) ;
    // console.log('start',Distance) 
    // this.scroll.target = this.scroll.last - (Distance/8);
// console.log('scroll',this.scroll.target)
  }

  onTouchUp(e) {
    this.isDown = false
    // this.speed.target = 0
    const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    this.scroll.target = y;
  }

  onWheel({ pixelY }) {
    this.scroll.target += pixelY;
  }

  // Loop

  update() {
    // const h = this.scroll.current / window.innerHeight;
    // this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)
    // this.scroll.target = GSAP.utils.clamp( -this.scroll.limit, 0, this.scroll.target)
                   
    // this.scroll.target = GSAP.utils.clamp( this.y.start, window.innerHeight, this.scroll.target);
    // this.scroll.last = GSAP.utils.clamp( 0, this.scroll.limit, this.scroll.target);
    // console.log('target',this.scroll.target)

    
    this.scroll.current = GSAP.utils.interpolate( this.scroll.current, this.scroll.target, 0.05);
    // console.log('current',this.scroll.current)
        if (this.scroll.current < 0.01) {
          this.scroll.current = 0;
        }
        
        if (this.elements.wrapper) {
          this.elements.wrapper.style[
            this.transformPrefix
          ] = `translateY(-${this.scroll.current}px)`;
        }
        
        // this.scroll.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)
    if (this.scroll.target < this.scroll.current){
      this.y.direction = 'top'
      // console.log('top')
}
else if (this.scroll.target > this.scroll.current){
      this.y.direction = 'bottom'
      // console.log('bottom')
}


  }

  // Listeners

  addEventListeners() {}

  removeEventListeners() {}

  // Destroy

  destroy() {
    this.removeEventListeners();
  }
}