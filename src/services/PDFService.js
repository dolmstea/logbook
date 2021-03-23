import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from 'pdfmake/build/vfs_fonts';

import firebase from 'firebase/app';
import 'firebase/firestore';

//import * as d3 from 'd3';
//import Chart from 'chart.js';
import QuickChart from 'quickchart-js';

//pdfMake.vfs = pdfFonts.pdfMake.vfs;

//TODO: Add number of procedures done.

class PDFService {
    constructor(userID) {
        this.userID = userID;
    }

    arrayToString(ar) {
        var output = '';

        for (var i in ar) {
            output = output.concat(`${ar[i]}, `);
        }

        output = output.slice(0, -2);

        return output;
    }

    async genPDF() {
        var db = firebase.firestore();

        console.log(this.userID);

        var qs = await db.collection(this.userID).orderBy('date').get();

        var tables = [];
        var logsByDate = {};

        var totalCases = 0;
        var generalCases = 0;
        var spinalCases = 0;
        var intubations = 0;
        var spinals = 0;
        var ivs = 0;
        var artLines = 0;
        var centralLines = 0;
        var regionalBlocks = 0;

        var asa1 = 0;
        var asa2 = 0;
        var asa3 = 0;
        var asa4 = 0;
        var asa5 = 0;
        var asa6 = 0;

        qs.forEach((doc) => {
            const data = doc.data();

            if (data.date in logsByDate) {
                logsByDate[data.date].push(data);
            } else {
                logsByDate[data.date] = [data];
            }
        });

        for (var date in logsByDate) {
            var thisTable = {
                layout: 'lightHorizontalLines',
                style: 'table',
                table: {
                    headerRows: 1,
                    widths: ['*', 15, 16, 40, 50, 50, 50, 50, 30],
                    body: [
                        [
                            date === '' ? 'No Date' : date,
                            'Age',
                            'ASA',
                            'Location',
                            'Staff',
                            'Service',
                            'Type',
                            'Procedures',
                            'EPAs',
                        ],
                    ],
                },
            };

            for (var index in logsByDate[date]) {
                var log = logsByDate[date][index];

                totalCases++;

                if (log.type.includes('GA')) {
                    generalCases++;
                }
                if (log.type.includes('Spinal')) {
                    spinalCases++;
                }

                if (log.procedures.includes('Intubation')) {
                    intubations++;
                }
                if (log.procedures.includes('Spinal')) {
                    spinals++;
                }
                if (log.procedures.includes('IV')) {
                    ivs++;
                }
                if (log.procedures.includes('Art Line')) {
                    artLines++;
                }
                if (log.procedures.includes('Central Line')) {
                    centralLines++;
                }

                switch (log.asa) {
                    case '1':
                        asa1++;
                        break;
                    case '2':
                        asa2++;
                        break;
                    case '3':
                        asa3++;
                        break;
                    case '4':
                        asa4++;
                        break;
                    case '5':
                        asa5++;
                        break;
                    case '6':
                        asa6++;
                        break;
                }

                thisTable.table.body.push([
                    log.case,
                    log.age,
                    `${log.asa} ${log.e ? 'E' : ''}`,
                    log.location,
                    log.staff,
                    log.service,
                    this.arrayToString(log.type),
                    this.arrayToString(log.procedures),
                    this.arrayToString(log.epas),
                ]);

                if (log.comments !== '') {
                    thisTable.table.body.push([
                        {
                            text: `Comments: ${log.comments}`,
                            fontSize: 6,
                            colSpan: 9,
                        },
                    ]);
                }
            }

            tables.push(thisTable);

            tables.push('\n');
        }

        //Prototype for PDF data.
        var ts = [
            {
                table: {
                    headerRows: 1,
                    widths: [],
                    body: [
                        ['DATE', 'Age', 'ASA', 'Location', 'Staff', 'Service', 'Anesthetic Type', 'Procedures', 'EPAs'],
                        ['data', 'data', 'data'],
                        ['comments'],
                        ['data', 'data', 'data'],
                        ['comments'],
                    ],
                },
            },
        ];

        //Generate pie chart.
        const chartHeight = 130;
        const chartWidth = 250;

        const chart = new QuickChart();
        chart
            .setConfig({
                type: 'pie',
                data: {
                    datasets: [
                        {
                            data: [asa1, asa2, asa3, asa4, asa5, asa6],
                            backgroundColor: ['#2196f3', '#4caf50', '#ffeb3b', '#ff9800', '#f44336', '#795548'],
                        },
                    ],
                    labels: ['ASA I', 'ASA II', 'ASA III', 'ASA IV', 'ASA V', 'ASA VI'],
                },
                options: {
                    legend: {
                        position: 'right',
                        labels: {
                            fontColor: '#000000',
                            fontSize: 60,
                        },
                        
                    },
                    plugins: {
                        datalabels: {
                            color: '#000000',
                            font: {
                                size: 60
                            },
                            //anchor: 'end',
                            //display: 'auto',
                        }
                    }
                }
            })
            .setWidth(chartWidth * 8)
            .setHeight(chartHeight * 8)
            .setBackgroundColor('transparent');

        const chartDataUrl = await chart.toDataUrl();
        const chartUrl = chart.getUrl();

        pdfMake.fonts = {
            Roboto: {
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                //        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                //        bolditalics:
                //            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
            },
        };

        pdfMake.tableLayouts = {
            custom: {
                hLineWidth: (i) => 0.25,
                vLineWidth: (i) => 0.25
            }
        };

        var docDefinition = {
            defaultStyle: {
                fontSize: 10,
            },
            styles: {
                table: {
                    fontSize: 8,
                },
            },
            content: [
                { text: 'Anesthesia Logbook Report', bold: true, fontSize: 24 },

                { text: 'David Olmstead', alignment: 'right', bold: true, fontSize: 12 },
                { text: 'January 30, 2021 - March 28, 2021', alignment: 'right' },
                { text: `Generated ${new Date().toDateString()}`, alignment: 'right' },
                '\n',

                { text: 'Summary Data', bold: true },

                '\n',

                {
                    columns: [
                        {
                            table: {
                                widths: ['*', 'auto'],
                                body: [
                                    ['Total Cases: ', totalCases],
                                    ['General Cases: ', generalCases],
                                    ['Spinal Cases: ', spinalCases],
                                    ['Intubations: ', intubations],
                                    ['Spinals: ', spinals],
                                    ['IVs: ', ivs],
                                    ['Arterial Lines:', artLines],
                                    ['Central Lines:', centralLines],
                                ],
                            },
                            width: '*',
                            layout: 'lightHorizontalLines'
                        },
                        {
                            image: chartDataUrl,
                            margin: [0, 0, 0, 0],
                            height: chartHeight,
                            width: chartWidth
                        },
                    ],
                },

                '\n',

                {
                    text:
                        'Note: The above table represents a summary of the data contained in this logbook only. It does not include procedures performed outside of the OR.',
                    fontSize: 8,
                },

                '\n',
            ].concat(tables),
            footer: {
                columns: [
                    {
                        text: 'Generated using Logbook software by David Olmstead.',
                        fontSize: 6,
                        margin: [40, 10, 0, 0],
                    },
                    {
                        text: 'v1.0',
                        fontSize: 6,
                        margin: [0, 10, 40, 0],
                        alignment: 'right',
                    },
                ],
            },
        };

        //docDefinition.content.push(tables);

        pdfMake.createPdf(docDefinition).open();
    }
}

export default PDFService;
