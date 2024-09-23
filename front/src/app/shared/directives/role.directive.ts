import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit {

  @Input() allowedUserType: String = '';

  constructor( 
    private userService: UserService,
    private templateRef: TemplateRef<HTMLElement>,
    private viewContainerRed: ViewContainerRef
    ) { }

  ngOnInit(): void {
      this.userService.userType.subscribe((userType: String) => {
        if(userType === this.allowedUserType){
          this.viewContainerRed.createEmbeddedView(this.templateRef);
        }else{
          this.viewContainerRed.clear();
        }
      })
  }
    

}
