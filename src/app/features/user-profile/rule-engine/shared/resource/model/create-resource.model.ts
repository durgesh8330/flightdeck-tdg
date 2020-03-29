import { Application } from './application';
import { Workgroup } from './workgroup';
import { Skill } from './skill';

export class CreateResource {
    
    resourceName : string;
    resourceFirstName :string;
    resourceLastName : string;
    resourceCuid : string;
    resourceCapacity : number;
    createdByID : string;
    resourceApplications : Application [];
    resourceWorkgroups : Workgroup [];
    resourceSkills : Skill [];

    constructor(){}
}


