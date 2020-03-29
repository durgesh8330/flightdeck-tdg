import { Application } from './application';
import { Workgroup } from './workgroup';
import { Skill } from './skill';

export class ResourceResponse {
    
     resourceName : string ;
     resourceFirstName: string;
     resourceLastName: string;
     resourceEmailAddress: string;
     resourceTelelphoneNumber: string;
     resourceCuid: string;
     resourceManagerCUID: string;
     resourceTitle: string;
     resourceStreetNM: string;
     resourceCity: string;
     resourceState: string;
     resourcePostalCD: string;
     resourceCountry: string;
     resourceCompanyNM: string;
     resourceDepartmentNM: string;
     createdByID: string;
     createdDateTime: string;
     modifiedByID: string;
     modifiedDateTime: string;
     resourceCapacity : number;

    resourceApplications : Application [];
    resourceWorkgroups : Workgroup [];
    resourceSkills : Skill [];
    
    constructor(){}

}
