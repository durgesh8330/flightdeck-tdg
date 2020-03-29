import {Component, OnInit, Input} from '@angular/core';

declare var $:any;
declare var ActiveXObject:any;

@Component({
  selector: 'sa-full-screen',
  templateUrl: './full-screen.component.html'
})
export class FullScreenComponent implements OnInit {
  toolTipFullScreen = 'Full Screen';
  @Input() fullScreenIcon;
  constructor() {
  }

  ngOnInit() {
  }


  onToggle() {
    var $body = $('body');
    
    var documentMethods = {
      enter: ['requestFullscreen', 'mozRequestFullScreen', 'webkitRequestFullscreen', 'msRequestFullscreen', 'msFullscreenElement'],
      exit: ['cancelFullScreen', 'mozCancelFullScreen', 'webkitCancelFullScreen', 'msCancelFullScreen', 'msExitFullscreen']
    };
    
    if (!$body.hasClass("full-screen")) {
      $body.addClass("full-screen");
      this.toolTipFullScreen = 'Normal Screen';
      document.documentElement[documentMethods.enter.filter((method)=> {
        if (document.documentElement[method] != undefined && method == 'msRequestFullscreen') {
          var wscript = new ActiveXObject("Wscript.shell");
              wscript.SendKeys("{F11}");
          return false;
        } else {
          return document.documentElement[method];
        }
      })[0]]()
    } else {
      $body.removeClass("full-screen");
      this.toolTipFullScreen = 'Full Screen';
      document[documentMethods.exit.filter((method)=> {
        if (document[method] != undefined && method == 'msExitFullscreen') {
          var wscript = new ActiveXObject("Wscript.shell");
              wscript.SendKeys("{F11}");
          return false;
        } else {
          return document[method]
        }
        
      })[0]]()
    }
  }
}
