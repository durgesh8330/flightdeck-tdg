import { Application } from './application';
import { Workgroup } from './workgroup';
import { Skill } from './skill';

export class UpdateResource {
    
    resourceName : string;
    resourceFirstName :string;
    resourceLastName : string;
    resourceCuid : string;
    resourceCapacity : number;
    modifiedByID : string;
    createdByID : string;
    resourceWorkgroups : Workgroup [];
    resourceSkills : Skill [];
    resourceApplications : Application [];

    constructor(){}
}

