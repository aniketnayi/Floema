import GSAP from 'gsap';
import Button from '/app/classes/Button';
import Page from '/app/classes/Page';

export default class Detail extends Page {
    constructor() {
        super({
            id: 'detail',
            element: '.detail',
            elements: {
                Button : '.detail__button'
            }
        })
    }

    create(){
        super.create()
        this.link = new Button({
            element : this.elements.Button
        })
    }

    show(){
        const timeline = GSAP.timeline({
            delay: 2
        });
        timeline.fromTo(
          this.element,
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
          }
        );

        super.show(timeline)
    }

    destroy(){
        super.destroy()
        this.link.removeEventListeners()
    }
}