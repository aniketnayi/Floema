import GSAP from 'gsap'

import Animation from  '/app/classes/Animation'

import { calculate, split } from 'utils/text'

export default class Paragraph extends Animation{
    
    constructor ({element,elements}){
        super({
            element,
            elements
        })

        split({element: this.element , append:true})
        
        this.elementLinesSpans = split({
            append:true,
            element: this.element ,
        })
        this.onResize()
    }
    
    animateIn(){
        this.timelineIn = GSAP.timeline({
            delay:0.5,
        })
    
        this.timelineIn.to(this.element,{
                autoAlpha:1,
                duration:1
            })
            
        }
        
        animateOut(){           
            GSAP.set(this.element,{
                autoAlpha:0
            })  
        }
    
    onResize () {
        
        this.elementsLines = calculate(this.elementLinesSpans)
    }
}
