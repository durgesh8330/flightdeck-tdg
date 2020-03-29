import { Injectable } from '@angular/core';
import printJS from 'print-js';
declare var jsPDF: any;

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  public handlePagination(fullList: any[], paginationLimitOption: number) {
    return {
      pageNumber: 1,
      totalRecords: fullList.length,
      totalPage: Math.ceil(fullList.length / paginationLimitOption),
      listPerPage: fullList.slice(0, paginationLimitOption)
    }
  }

  public dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  public sortData(list: any[], isSortAsc: boolean, columnName: any) {
    if (isSortAsc) {
      isSortAsc = false;
      list.sort(this.dynamicSort(columnName));
    } else {
      isSortAsc = true;
      list.sort(this.dynamicSort('-' + columnName));
    }
  }

  public filterData(data: any) {
    
    data.filterFields.find(f => f.key === data.fieldName).value = data.criteriaValue;
    data.filterFields.forEach(field => {
      if (field.value !== "") {
        data.list = data.list.filter((role: any) => {
          return (role[field.key] && role[field.key].toUpperCase().indexOf((field.value).toUpperCase()) !== -1);
        });
      };
    });
    data.filterCleared = data.filterFields.every(field => field.value === "");
  }

  public printPDF(headers: any[], rows: any[], pdfName: string, pdfTitle: string){
    const columns = headers.map(header => {
      return {
        "title": header.label,
        "dataKey": header.fieldName
      }
    });
    var doc = new jsPDF('p', 'pt');
    doc.autoTable(columns, rows, {
      theme:'grid',
      styles:{fontStyle:'normal',fontSize:8,overflow:'linebreak'},
      addPageContent: function(data) {
        doc.text(pdfTitle, 30, 20);
      }
    });
    doc.save(`${pdfName}.pdf`);
      
    }
}
