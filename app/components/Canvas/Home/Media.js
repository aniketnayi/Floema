import Detection from "/app/classes/Detection";
import GSAP from "gsap";
import {Mesh, Program} from "ogl";
import vertex from "/app/shaders/home-vertex.glsl";
import fragment from "/app/shaders/home-fragment.glsl";

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
        const imagz = this.element;
        this.texture = window.TEXTURES[imagz.getAttribute('data-src')];

    }
    createProgram(){
        this.program = new Program(
            this.gl,{
            vertex,
            fragment,
            uniforms:{
                uAlpha: {value: 0},
                uSpeed: {value: 0},
                uViewportSizes : {value : [this.sizes.width, this.sizes.height]},
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
        
        this.mesh.rotation.z = GSAP.utils.random(-Math.PI*0.01, Math.PI*0.01)

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
            value:0.6
        })
    }

    hide(){

        GSAP.to(this.program.uniforms.uAlpha,{
            value:0
        })
    }


    onResize(sizes,scroll){
        this.extra = {
            x: 0,
            y: 0
        }
        this.createBound(sizes)
        this.updateX(scroll ? scroll.x : 0 )
        this.updateY(scroll ? scroll.y : 0 )
    }
    
    updateScale(){
        this.width = this.bounds.width / window.innerWidth;
        this.height = this.bounds.height / window.innerHeight;

        this.mesh.scale.x = this.sizes.width * this.width;
        this.mesh.scale.y = this.sizes.height * this.height;

    }
    updateX(x = 0){

        this.x = (this.bounds.left + x) / window.innerWidth;
        this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x  * this.sizes.width) + this.extra.x; // prettier-ignore
    
    }
    updateY(y = 0){
        this.y = (this.bounds.top + y) / window.innerHeight;
        this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y * this.sizes.height) +this.extra.y ;
    }
    update(scroll,speed){
        // if(!this.bounds) return
        this.updateX(scroll.x)
        this.updateY(scroll.y)
        
        this.program.uniforms.uSpeed.value = speed
    }

}
// updateY(Y=0){
    // const extra = Detection.isPhone() ? 20 : 40

    // 40-40 => extra-extra
// }