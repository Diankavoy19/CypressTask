class Opencart {
    get DateDropdown() {
        return cy.get(".input-group.date");
    }
    get DateCalendar() {
        return cy.get(".input-group.date .fa-calendar");
    }
    get MonthTitle() {
        return cy.get(".pull-right .datepicker-days table .picker-switch");
    }
    get Radiobutton() {
        return cy.get('#input-option218 input[type="radio"]');
    }
    get Checkboxes() {
        return cy.get('[type="checkbox"]');
    }
    get SelectDropdown() {
        return cy.get("#input-option217");
    }
    get UploadFileInput() {
        return cy.get('input[type="file"]');
    }
    get UploadFileButton() {
        return cy.get("button#button-upload222");
    }
    navigate() {
        return cy.visit("https://demo.opencart.ua/component/monitor/test");
    }
    selectDate(month, day) {
        this.MonthTitle.then(($header) => {
            if (!$header.text().includes(month.substring(0, 3))) {
                cy.get(".pull-right .datepicker-days table  .next").click();
                this.selectDate(month, day); 
            } else {
                cy.contains(".day", day.toString())
                    .should("be.visible")
                    .click({ force: true });
                    cy.wait(500);
                    cy.then(() => {
                    this.MonthTitle.should('not.be.visible')
                    });
            }
        });
    }
    selectOption(element, optionValue) {
        element.select(`${optionValue}`).then(() => {
            element.should("have.value", optionValue);
        });
    }
    uploadFile() {
        const alertStub = cy.stub();
        cy.on("window:alert", alertStub);

        this.UploadFileButton.click();
        this.UploadFileInput.attachFile("Img/valid-jpeg.jpg",{force: true});
        cy.wait(1000);

        cy.then(() => {
            expect(alertStub).to.be.calledOnce;
            expect(alertStub.getCall(0)).to.have.been.calledWith(
                "Ваш файл успішно завантажено!"
            );
        });
    }
}
export default Opencart;
