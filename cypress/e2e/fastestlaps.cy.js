import { beforeEach } from "mocha";
import Fastestlaps from "../pageobjects/fastestlaps";
describe("Fastestlaps Tests: sorting and selecting", () => {
    const base = new Fastestlaps();
    beforeEach(() => {
        base.navigate("https://fastestlaps.com/tracks/nordschleife");
        base.FilterDropdown.should("be.visible");
    });
    xit('Check time sorting by default"', () => {
        base.checkTimeSorting();
    });
    xit('Select Filter "Driver best"', () => {
        base.FilterDropdown.click();
        base.selectFilter("Driver best");
        cy.clickOutside();
        base.checkNoUndefinedDrivers();
    });
    xit('Select Filter "All lap times"', () => {
        base.checkCountIsMore();
    });
});

describe("Fastestlaps Tests: Filling fields", () => {
    const base = new Fastestlaps();
    let firstVehicle = "Honda Civic Type R";
    let secondVehicle = "VW Golf R32";

    before(() => {
        base.navigate("https://fastestlaps.com/create-comparison");
        base.FirstVehicleInput.should("be.visible");
    });
    it("Select Options", () => {
        base.selectOption(
            base.FirstVehicleInput,
            firstVehicle,
            "EP3 facelift EP3"
        );
        base.selectOption(base.SecondVehicleInput, secondVehicle, "Mk V");
    });
    it("Click Compare button and verify vehicles in header", () => {
        base.checkValue(base.SecondVehicleInput, "VW Golf R32 Mk V");
        base.checkVehiclesInHeader(
            "https://fastestlaps.com/comparisons/fcezn9fr88ss",
            {
                "EP3 facelift EP3": "",
                "Mk V": "",
            },
            firstVehicle,
            secondVehicle
        );
    });
    it("Verify vehicle characteristics and track times", () => {
        base.checkVehicleStats();
    });
});
