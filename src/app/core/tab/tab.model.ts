import {Type} from "@angular/core";
export class Tab{
    static  totalTabs:number=0;
    public id:number;
    public title:string;
    public url:string;
    public active:boolean;
    public removable:boolean;
    public tabData:any;
    constructor(public component: Type<any>, title:string, url:string,tabData:any){
        this.title = title;
        this.url = url;
        this.removable = true;
        this.tabData = tabData;      
        Tab.totalTabs++;
    }
}