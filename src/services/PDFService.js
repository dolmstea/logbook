import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import firebase from 'firebase/app';
import 'firebase/firestore';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

                thisTable.table.body.push([
                    {
                        text: `Comments: ${log.comments}`,
                        colSpan: 9,
                    },
                ]);
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

        pdfMake.fonts = {
            Roboto: {
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                bolditalics:
                    'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
            },
        };

        var docDefinition = {
            defaultStyle: {
                font: 'Roboto',
            },
            styles: {
                table: {
                    fontSize: 10
                }
            },
            content: [
                { text: 'Anaesthesia Logbook Report', bold: true, fontSize: 24 },
                '\n',
                { text: 'David Olmstead' },
                '\n',
                { text: `Generated: ${new Date().toDateString()}` },
                '\n',
                {
                    table: {
                        widths:['auto', '*'],
                        body: [
                            ['Summary Data', ''],
                            ['Total Cases', ''],
                            ['General Cases', ''],
                            ['Spinal Cases', ''],
                            ['Intubation', ''],
                            ['Spinal', ''],
                            ['IV', ''],
                            ['Art Line', ''],
                            ['Central Line', ''],
                            ['Regional Block', '']
                        ]
                    }
                },
                '\n',
            ].concat(tables),
        };

        //docDefinition.content.push(tables);

        pdfMake.createPdf(docDefinition).open();
    }
}

export default PDFService;
