import Opencart from "../pageobjects/opencart";
describe('Opencart Tests', () => {
  const base = new Opencart();
  beforeEach(() => {
	base.navigate();
  });
  it('Select Date', () => {
	base.DateCalendar.click();
    base.selectDate('December', 15);
  });

  it('Check the radiobutton', () => {
    base.Radiobutton.first().check()
    .then(() => {
		base.Radiobutton.first().should('be.checked');
  });
  });

  it('Check checkboxes', () => {
    base.Checkboxes.check()
	.then(() => {
		base.Checkboxes.each(($checkbox) => {
		  expect($checkbox[0].checked).to.be.true;
		});
	});
  });

  it('Select option from dropdown', () => {
    base.selectOption(base.SelectDropdown, 2);
  });

  it('Upload File', () => {
    base.uploadFile();
  });
});