import Button from '/app/classes/Button';
import Page from '/app/classes/Page';

export default class Home extends Page {

    constructor() {
        super({
            id: 'home',
            element: '.home',
            elements: {
                navigation : document.querySelector('.navigation'),
                link : '.home__link'
            }
        })
    }

    create(){
        super.create()
        this.link = new Button({
            element : this.elements.link
        })
    }

    destroy(){
        super.destroy()
        this.link.removeEventListeners()
    }


}