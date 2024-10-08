import GSAP from 'gsap';
import map from 'lodash/map';
import Media from './Media';
import { Plane, Transform, Mesh } from 'ogl';


export default class {
    constructor({gl,scene,sizes}){
        this.gl = gl
        this.sizes = sizes
        this.scene = scene

        this.group = new Transform()
        
        this.galleryElement = document.querySelector('.home__gallery')
        this.mediasElement = document.querySelectorAll('.home__gallery__media__image');
        
        
        this.x = {
            current: 0,
            target: 0,
            lerp: 0.1,
        };
    
        this.y = {
            current: 0,
            target: 0,
            lerp: 0.1,
        };

        this.scrollCurrent = {
            x: 0,
            y: 0,
        };
        
        this.scroll = {
            x: 0,
            y: 0,
        };

        
        this.speed = {
            current: 0,
            target: 0,
            lerp: 0.1,
        };
        
        
        this.createGeometry()
        this.createGallery()
        this.onResize({
            sizes: this.sizes,
        })
        this.group.setParent(this.scene)
        this.show()
    }
    
    createGeometry(){
        this.geometry = new Plane(this.gl,{
            heightSegments: 20,
            widthSegments:20
        })
    }
    
    createGallery(){
        this.gallery = new Transform()
        
        this.medias = map(this.mediasElement, (element, index) => {
            
            return new Media({
                element,
                geometry: this.geometry,
                index,
                gl: this.gl,
                scene:this.group,
                sizes: this.sizes
            })
    
        })
    }

    
    show(){
        map(this.medias, media => media.show())
        
    }
    
    hide(){
        map(this.medias, media => media.hide())

    }

    
            onResize (e) {
                this.galleryBounds = this.galleryElement.getBoundingClientRect()
                this.sizes = e.sizes;
                this.gallerySizes = {
                    Width : this.galleryBounds.width / window.innerWidth * this.sizes.width,
                    Height : this.galleryBounds.height / window.innerHeight * this.sizes.height
                    
                }

                this.scroll.x = this.x.target = 0
                this.scroll.y = this.y.target = 0

                map(this.medias,media => media.onResize(e,this.scroll))
            }


            onTouchDown ({ x, y }) {
            this.speed.target = 1
            this.scrollCurrent.x = this.scroll.x;
            this.scrollCurrent.y = this.scroll.y;
            // this.scrollCurrent = this.scroll;
            }

            onTouchMove ({ x, y }) {
  
            const xDistance = x.start - x.end;
            const yDistance = y.start - y.end;
            // console.log('yd',yDistance)
        
            this.x.target = this.scrollCurrent.x - xDistance;
            this.y.target = this.scrollCurrent.y - yDistance;
                // console.log('yt',this.y.target)
            }

            onTouchUp ({ x, y }) {
            this.speed.target = 0
            }

            onWheel({pixelX,pixelY}){
                    this.x.target += pixelX;
                    this.y.target += pixelY;
            }

            update () {
                // if (!this.galleryBounds) return

                
                this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)

                this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
                this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

                if (this.scroll.x < this.x.current){
                        this.x.direction = 'right'
                }
                else if (this.scroll.x > this.x.current){
                        this.x.direction = 'left'
                }

                if (this.scroll.y < this.y.current){
                        this.y.direction = 'top'
                }
                else if (this.scroll.y > this.y.current){
                        this.y.direction = 'bottom'
                }


                this.scroll.x = this.x.current
                this.scroll.y = this.y.current


                map(this.medias, (media, index) => {
                 
                  const  scaleX = media.mesh.scale.x / 2
                  const  positionX = media.mesh.position.x
                  const offsetX = this.sizes.width * 0.6

                    if (this.x.direction === 'left' ){

                        const x = positionX + scaleX
                        
                            if ( x < -offsetX){
                                media.extra.x += this.gallerySizes.Width 
                                media.mesh.rotation.z = GSAP.utils.random(-Math.PI*0.01, Math.PI*0.01)
                            }
                        }
                        else if (this.x.direction === 'right' ){
                            const x = positionX - scaleX
                            
                            if ( x > offsetX){
                                media.extra.x -= this.gallerySizes.Width
                                media.mesh.rotation.z = GSAP.utils.random(-Math.PI*0.01, Math.PI*0.01)
                            } 
                        }
                        
                        
                        const  scaleY = media.mesh.scale.y / 2
                        const  positionY = media.mesh.position.y
                        const offsetY = this.sizes.height * 0.6
                  
                        if (this.y.direction === 'top' ){
                            
                            const y = positionY + scaleY
                            
                            if ( y < -offsetY){
                                media.extra.y += this.gallerySizes.Height 
                                media.mesh.rotation.z = GSAP.utils.random(-Math.PI*0.01, Math.PI*0.01)
                            }
                        }
                        else if (this.y.direction === 'bottom' ){
                            const y = positionY - scaleY
                            
                            if ( y > offsetY){
                                media.extra.y -= this.gallerySizes.Height
                                media.mesh.rotation.z = GSAP.utils.random(-Math.PI*0.01, Math.PI*0.01)
                            } 
                        }
                    

                    media.update(this.scroll ,this.speed.current)
                })
            }


            destroy(){
                this.scene.removeChild(this.group)
                // this.scene.removeChild(this.gallery)
            }
}