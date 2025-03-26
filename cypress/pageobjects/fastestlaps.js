class Fastestlaps {
    get FilterDropdown() {
        return cy.get("#filter-trigger");
    }
    get Radiobutton() {
        return cy.get('input[type="radio"]');
    }
    get Checkboxes() {
        return cy.get('[type="checkbox"]');
    }
    get FirstVehicleInput() {
        return cy.get('[placeholder="Please select"]').first();
    }
    get SecondVehicleInput() {
        return cy.get('[placeholder="Please select"]').last();
    }
    get CompareButton() {
        return cy.get(".inputRow .buttonPrimary");
    }
    get Header() {
        return cy.get(".section h1");
    }
    navigate(url) {
        return cy.visit(url, {
            timeout: 30000,
        });
    }
    checkTimeSorting() {
        const timeToMilliseconds = (time) => {
            const [hours, minutesAndSeconds] = time.split(":");
            let minutes, seconds;

            if (hours.length === 1) {
                minutes = hours;
                seconds = minutesAndSeconds;
            } else {
                minutes = minutesAndSeconds.split(".")[0];
                seconds = minutesAndSeconds.split(".")[1] || 0;
            }

            return (parseInt(minutes) * 60 + parseFloat(seconds)) * 1000;
        };

        cy.get("table tr td:nth-child(4)").then(($times) => {
            const timeArray = $times
                .toArray()
                .map((item) => item.innerText.trim());
            const sortedTimeArray = [...timeArray].sort((a, b) => {
                return timeToMilliseconds(a) - timeToMilliseconds(b);
            });

            const timeArrayInMilliseconds = timeArray.map((time) =>
                timeToMilliseconds(time)
            );
            const sortedTimeArrayInMilliseconds = sortedTimeArray.map((time) =>
                timeToMilliseconds(time)
            );

            let isEqual = true;
            for (let i = 0; i < timeArrayInMilliseconds.length; i++) {
                if (
                    i > 0 &&
                    timeArrayInMilliseconds[i] ===
                        timeArrayInMilliseconds[i - 1]
                ) {
                    continue;
                }

                const difference = Math.abs(
                    timeArrayInMilliseconds[i] -
                        sortedTimeArrayInMilliseconds[i]
                );
                if (difference > 0) {
                    isEqual = false;
                    cy.log(`Significant difference found at index ${i}.`);
                }
            }

            cy.log(`Comparison result: ${isEqual ? "Passed" : "Failed"}`);
            expect(isEqual).to.be.true;
        });
    }

    selectFilter(text) {
        cy.get("label")
            .filter((index, label) => label.innerText.trim() === text)
            .find('input[type="radio"]')
            .check();
        cy.wait(500);
    }

    checkNoUndefinedDrivers() {
        cy.get("table tr td:nth-child(3)").each(($cell) => {
            const text = $cell.text().trim();
            expect(text).to.not.equal("unknown");
        });
    }

    checkCountIsMore() {
        cy.get("table tr").then((rows) => {
            const initialCount = rows.length;

            this.FilterDropdown.click();
            this.selectFilter("All lap times");
            cy.clickOutside();

            cy.get("table tr").should(($newRows) => {
                expect($newRows.length).to.be.greaterThan(initialCount);
            });
        });
    }

    selectOption(element, textValue, dataHint) {
        element.type(textValue, { delay: 100 });
        cy.wait(500);
        cy.get(`[data-hint="${dataHint}"]`).click();
    }

    checkValue(element, expectedValue) {
        element.eq(0).invoke("val").should("eq", expectedValue);
    }

    checkVehiclesInHeader(
        apiUrl,
        replacements = {},
        firstVehicle,
        secondVehicle
    ) {
        cy.intercept("GET", apiUrl).as("comparisonPage");
        this.FirstVehicleInput.invoke("val").then((firstVehicle) => {
            this.SecondVehicleInput.invoke("val").then((secondVehicle) => {
                this.CompareButton.click();
                cy.wait("@comparisonPage").then((interception) => {
                    expect(interception.response.statusCode).to.eq(200);
                });
                const cleanName = (name) => {
                    Object.keys(replacements).forEach((key) => {
                        name = name.replace(key, replacements[key]);
                    });
                    return name.trim();
                };
                const firstVehicleName = cleanName(firstVehicle);
                const secondVehicleName = cleanName(secondVehicle);
                this.Header.invoke("text")
                    .should("include", firstVehicleName)
                    .and("include", secondVehicleName);
            });
        });
        cy.url().should("include", "/comparisons/fcezn9fr88ss");
    }

    checkVehicleStats() {
        cy.document().then((doc) => {
            const rows = Array.from(
                doc.querySelectorAll(
                    ".section:nth-Child(2) table.fl-comparison tbody tr"
                )
            );

            const actualData = rows.map((row) => {
                const cells = row.querySelectorAll("td");
                return {
                    track: cells[0].textContent.trim(),
                    civic: cells[1].textContent.trim(),
                    golf: cells[2].textContent.trim(),
                };
            });

            const expectedData = [
                { track: "Top Gear Track", civic: "1:32.80", golf: "1:30.40" },
                { track: "Balocco", civic: "3:04.90", golf: "3:02.15" },
                {
                    track: "Hockenheim Short",
                    civic: "1:20.40",
                    golf: "1:19.30",
                },
            ];
            expect(actualData.length).to.eq(expectedData.length);

            actualData.forEach((row, index) => {
                expect(row.track).to.eq(expectedData[index].track);
                expect(row.civic).to.eq(expectedData[index].civic);
                expect(row.golf).to.eq(expectedData[index].golf);
            });
        });
    }
}
export default Fastestlaps;
