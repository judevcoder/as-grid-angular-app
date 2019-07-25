import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { AgGridAngular } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { RedComponentComponent } from "../red-component/red-component.component";
import { DataService } from "../@services/get-data.service";

@Component({
    selector: 'app-my-grid-application',
    templateUrl: './my-grid-application.component.html',
    styleUrls: ['./my-grid-application.component.scss']
})
export class MyGridApplicationComponent implements OnInit {

    private gridOptions: GridOptions;
    private gridApi;
    private gridColumnApi;
    private overlayLoadingTemplate;
    // private overlayNoRowsTemplate;
    private columnDefs;
    private rowData = [];

    title = 'grid app';

    constructor(
        private http: HttpClient,
        private dataService: DataService
    ) {
        this.columnDefs = [
        {
            headerName: '', 
            field: 'thumbnails', 
            sortable: true, 
            filter: true
        },
        {
            headerName: 'Published on', 
            field: 'publishedAt', 
            sortable: true, 
            filter: true
        },
        {
            headerName: 'Video Title', 
            field: 'title', 
            sortable: true, 
            filter: true,
            cellRenderer: this.customCellRendererFunc
        },
        {
            headerName: 'Description', 
            field: 'description', 
            sortable: true, 
            filter: true
        }
    ];

        this.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';
        // this.overlayNoRowsTemplate = "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">This is a custom 'no rows' overlay</span>";
    }

    onGridReady(params) {
        this.gridApi = params.api; // To access the grids API
        this.gridColumnApi = params.columnApi;
        this.gridApi.showLoadingOverlay();
        this.loadData();
    }

    ngOnInit() {
        
    }

    public loadData() {
        this.dataService.getData().subscribe(data => {
            let json_datas = data.items;
            for (var index in json_datas) {
                let row = {};
                row['thumbnails'] = json_datas[index]['snippet']['thumbnails']['default']['url'];
                row['publishedAt'] = json_datas[index]['snippet']['publishedAt'];
                row['title'] = {};
                row['title']['value'] = json_datas[index]['snippet']['title'];
                row['title']['id'] = json_datas[index]['id']['videoId'];
                row['description'] = json_datas[index]['snippet']['description'];
                this.rowData.push(row);
            }
            this.gridApi.setRowData(this.rowData);
        })
    }

    public customCellRendererFunc(params) {
        console.log(params);
        let videoTitle = params.value.value;
        let videoId = params.value.id;
        return "<a href='https://www.youtube.com/watch?v=" + videoId + "'>" + videoTitle+ "</a>";
    }

}