import each from 'lodash/each';

import NormalizeWheel from 'normalize-wheel'
import Navigation from 'components/Navigation'
import Preloader from 'components/Preloader'
import Canvas from './components/Canvas/Index';
import Detection from 'classes/Detection'

import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'

class App{
    constructor () {
        this.createContent()

        this.createCanvas()
        this.createPreloader()
        this.createNavigation()
        this.createPages()

        this.addEventListeners()
        this.addLinkListeners()

        this.onResize()
        
        this.update()
    }

    createNavigation(){
        this.navigation = new Navigation({
        template: this.template,
        })
        
    }

    createPreloader(){
        this.preloader = new Preloader(
          {
           canvas : this.canvas
          }
        )
        this.preloader.once('completed',this.onPreloaded.bind(this))
    }
    
    createCanvas(){
        this.canvas = new Canvas({
          template: this.template,
        });
    }

    createContent(){
        
        this.content = document.querySelector('.content');
        this.template = this.content.getAttribute('data-template');
        
    }
    
    createPages(){
        this.pages = {
            about : new About(),
            collections : new Collections(),
            home : new Home(),
            detail : new Detail(),
        };
        
        this.page = this.pages[this.template];
        this.page.create();

        this.navigation.onChange(this.template)

    }
    
    onPreloaded(){
        this.onResize();
        this.canvas.onPreloaded()
        this.preloader.destroy()
        this.page.show()
    }
    
    onPopState(){
        this.onChange({
            url: window.location.pathname,
            push : true,            
        })
    }

    async onChange ({url, push = true}) { 
        this.canvas.onChangeStart(this.template,url)

        await this.page.hide()
        
        const request = await window.fetch(url)
        
        if (request.status === 200){
            const html = await request.text()
            const div = document.createElement('div')
            if (push){

                window.history.pushState({},'',url)
            }

            div.innerHTML = html
            
            const divContent = div.querySelector('.content')
            
            this.template = divContent.getAttribute('data-template')
            
            this.navigation.onChange(this.template)

            this.content.setAttribute('data-template', this.template)
            this.content.innerHTML = divContent.innerHTML
            
            this.canvas.onChangeEnd(this.template)

            this.page = this.pages[this.template]
        
            this.page.create()
            
            this.onResize()
            this.page.show()

            this.addLinkListeners()
              
        }  else{
                console.log('error');
            }
            
        }

        onResize (){
           if (this.canvas && this.canvas.onResize){
                this.canvas.onResize()
           }
            if (this.page && this.page.onResize) {
                this.page.onResize()
              }

              window.requestAnimationFrame(_=>{
                if (this.canvas && this.canvas.onResize){
                    this.canvas.onResize()
               }
              }) 
        }

        onTouchDown(e) {
          
          if (this.page && this.page.update) {
            this.page.onTouchDown(e);
          }
            if (this.canvas && this.canvas.onTouchDown) {
              this.canvas.onTouchDown(e);
            }

            // if (this.pages.about && this.pages.about.update) {
            //   this.pages.about.onTouchDown(e);
            // }
          }
        
          onTouchMove(e) {
            if (this.page && this.page.update) {
              this.page.onTouchMove(e);
            }
            if (this.canvas && this.canvas.onTouchMove) {
              this.canvas.onTouchMove(e);
            }
            
            // if (this.pages.about && this.pages.about.update) {
            //   this.pages.about.onTouchMove(e);
            // }
          }
          
          onTouchUp(e) {
            if (this.page && this.page.update) {
              this.page.onTouchUp(e);
            }
            if (this.canvas && this.canvas.onTouchUp) {
              this.canvas.onTouchUp(e);
            }
            // if (this.pages.about && this.pages.about.update) {
            //   this.pages.about.onTouchUp(e);
            // }
          }
          
          onWheel(e) {
            const normalizeWheel = NormalizeWheel(e)
            
            if (this.page && this.page.update) {
              this.page.onWheel(normalizeWheel);
            }
            
            if (this.canvas && this.canvas.update) {
              this.canvas.onWheel(normalizeWheel);
              }
                        
          }
        
        update(){

            if (this.page && this.page.update) {
                this.page.update();
            }
            
            if (this.canvas && this.canvas.update) {
                this.canvas.update(this.page.scroll);
              }
              
            this.frame = window.requestAnimationFrame(this.update.bind(this));
        }
        
        addEventListeners(){
          window.addEventListener('popstate',this.onPopState.bind(this))
            
            window.addEventListener('wheel', this.onWheel.bind(this));
            window.addEventListener('mousedown', this.onTouchDown.bind(this));
            window.addEventListener('mousemove', this.onTouchMove.bind(this));
            window.addEventListener('mouseup', this.onTouchUp.bind(this));

            window.addEventListener('touchstart', this.onTouchDown.bind(this));
            window.addEventListener('touchmove', this.onTouchMove.bind(this));
            window.addEventListener('touchend', this.onTouchUp.bind(this));

            window.addEventListener('resize',this.onResize.bind(this));
        }

        addLinkListeners() {
            const links = document.querySelectorAll('a');
        
            each(links, link => {
              link.onclick = event => {
                event.preventDefault();
        
                const { href } = link;
                this.onChange({url: href});
                
              };
            });
        }
}


new App();