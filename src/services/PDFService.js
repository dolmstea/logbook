import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from 'pdfmake/build/vfs_fonts';

import firebase from 'firebase/app';
import 'firebase/firestore';

//import * as d3 from 'd3';
//import Chart from 'chart.js';

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
                layout: 'lightHorizontalLine',
                fontSize: 10,
                table: {
                    headerRows: 1,
                    widths: ['auto', 20, 20, '*', '*', '*', '*', '*', '*'],
                    body: [
                        [
                            date === '' ? 'No Date' : date,
                            'Age',
                            'ASA',
                            'Location',
                            'Staff',
                            'Service',
                            'Anaesthetic Type',
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
                layout: 'lightHorizontalLine',
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
        //var ctx = document.createElement('canvas');
        //var chart = new Chart(ctx, {
        //    type: 'pie',
        //    data: {
        //        datasets: [
        //            {
        //                data: [asa1, asa2, asa3, asa4, asa5],
        //            },
        //        ],
        //        labels: ['ASA I', 'ASA II', 'ASA III', 'ASA IV', 'ASA V'],
        //    },
        //});
        //var img = chart.toBase64Image();

        pdfMake.fonts = {
            Roboto: {
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                //        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                //        bolditalics:
                //            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
            },
        };

        var docDefinition = {
            //defaultStyle: {
            //    font: 'Roboto',
            //},
            styles: {
                table: {
                    fontSize: 10,
                },
            },
            content: [
                { text: 'Anaesthesia Logbook Report', bold: true, fontSize: 24 },
                '\n',
                'Logbook Data from  to  inclusive.',
                '\n',
                { text: 'David Olmstead' },
                '\n',
                { text: `Generated: ${new Date().toDateString()}` },
                '\n',

                { text: 'Summary Data', bold: true },

                {
                    columns: [
                        [
                            'Total Cases: ',
                            'General Cases: ',
                            'Spinal Cases: ',
                            'Intubations: ',
                            'Spinals: ',
                            'IVs: ',
                            'Art Lines: ',
                            'Central Lines: ',
                            'Regional Blocks: ',
                        ],
                        [
                            totalCases,
                            generalCases,
                            spinalCases,
                            intubations,
                            spinals,
                            ivs,
                            artLines,
                            centralLines,
                            regionalBlocks,
                        ],
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
                        fontSize: 10,
                        margin: [40, 0, 0, 0],
                    },
                    {
                        text: 'v1.0',
                        fontSize: 10,
                        margin: [0, 0, 40, 0],
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
