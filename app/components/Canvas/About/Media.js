import {Mesh, Program, Texture} from "ogl";
import GSAP from "gsap";
import Detection from "/app/classes/Detection";
import vertex from "/app/shaders/plane-vertex.glsl";
import fragment from "/app/shaders/plane-fragment.glsl";

export default class  {
    constructor ({element, geometry,index, gl, scene , sizes}){
        this.element = element
        this.geometry = geometry
        this.gl = gl
        this.scene = scene
        this.index = index
        this.sizes = sizes
        this.extra = {
            x: 0,
            y: 0
        }

        this.createTexture()
        this.createProgram()
        this.createMesh()
        this.createBound({
            sizes:this.sizes
        })
    }
    createTexture(){
        const image = this.element.querySelector('img')
        this.texture = window.TEXTURES[image.getAttribute('data-src')]
    }
    createProgram(){
        this.program = new Program(this.gl,{
            vertex,
            fragment,
            uniforms:{
                uAlpha: {value: 0},
                tMap: {value: this.texture}
            }
        })
    }
    createMesh(){
        this.mesh = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program
        })
        
        this.mesh.setParent(this.scene)
        
        // this.mesh.rotation.z = GSAP.utils.random(-Math.PI*0.01, Math.PI*0.01)

    }

    createBound({sizes}){
        this.sizes = sizes
        this.bounds = this.element.getBoundingClientRect()
        
        this.updateScale()
        this.updateX()
        this.updateY()

    }

    show(){
        GSAP.fromTo(this.program.uniforms.uAlpha, {
            value:0
        },{
            value:1
        })
    }

    hide(){
        GSAP.to(this.program.uniforms.uAlpha,{
            value:0
        })
    }

    onResize(sizes,scroll){
        this.extra = 0;
        this.createBound(sizes)
        this.updateX(scroll)
        this.updateY( 0 )
    }
    
    updateRotation(){
        this.mesh.rotation.z = GSAP.utils.mapRange(
            -this.sizes.width / 2, this.sizes.width / 2, Math.PI * 0.1, -Math.PI * 0.1, this.mesh.position.x
            )
    }

    updateScale(){
        this.width = this.bounds.width / window.innerWidth;
        this.height = this.bounds.height / window.innerHeight;

        this.mesh.scale.x = this.sizes.width * this.width;
        this.mesh.scale.y = this.sizes.height * this.height;

        // const scale = GSAP.utils.mapRange(0,this.sizes.width / 2,0.1,0,Math.abs(this.mesh.position.x))

        // this.mesh.scale.x += scale
        // this.mesh.scale.y += scale

    }
    updateX(x = 0){

        this.x = (this.bounds.left + x) / window.innerWidth;
        this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x  * this.sizes.width) + this.extra; // prettier-ignore
    
    }
    updateY(y = 0){
        this.y = (this.bounds.top + y) / window.innerHeight;
        
        const ex = Detection.isPhone ? 20 : 40
        
        this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height)  ;
        // this.mesh.position.y += Math.cos((this.mesh.position.x / this.sizes.width ) * Math.PI * 0.1) * ex - ex ;
        this.mesh.position.y += Math.cos((this.mesh.position.x / this.sizes.width ) * Math.PI * 0.1) * 58 - 58 ;
    }
    update(scroll){
        // if(!this.bounds) return
        this.updateRotation()
        this.updateScale()
        this.updateX(scroll)
        this.updateY(0)
        // console.log('log')
    }

}
// updateY(Y=0){

    // 40-40 => extra-extra
// }