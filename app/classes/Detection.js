class Detection{
    
    isPhone(){
    if(!this.isPhoneChecked){
        this.isPhoneChecked = true
        this.isPhone = document.documentElement.classList.contains('phone')
    }   
    return this.isPhoneCheck
    
}
    
    isTablet(){
        if(!this.isTabletChecked){
            this.isTabletChecked = true
            this.isTabletChecked = document.documentElement.classList.contains('tablet')
        }   
        return this.isTabletCheck
            
    }

    isDesktop(){
        if(!this.isDesktopChecked){
            this.isDesktopChecked = true
            this.isDesktopChecked = document.documentElement.classList.contains('desktop')
        }   
        return this.isDesktopCheck
            
        
    }
}

const DetectionManger = new Detection()

export default DetectionManger