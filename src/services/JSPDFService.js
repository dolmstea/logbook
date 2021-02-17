import { jsPDF } from 'jspdf';

class JSPDFService {
    constructor(userID) {
        this.userID = userID;
    }

    async genPDF() {
        const doc = new jsPDF();
    }
}

export default JSPDFService;