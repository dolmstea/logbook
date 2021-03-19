import React from 'react';
import { jsPDF } from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';

class ChartistPDFService {
    constructor(userID, stagingArea) {
        this.userID = userID;
        this.stagingArea = stagingArea;
    }

    async genPDF() {
        var adr = encodeURI("https://quickchart.io/chart?c={type:'bar',data:{labels:[2012,2013,2014,2015,2016],datasets:[{label:'Users',data:[120,60,50,180,120]}]}}");

        //var xhr = new XMLHttpRequest();



        var doc = {
            content: [
                {
                    image: 'chart',
                    width: 150
                }
            ],
            images: {
                chart: adr
            }
        }

        pdfMake.createPdf(doc).open();
    }
}

export default ChartistPDFService;
