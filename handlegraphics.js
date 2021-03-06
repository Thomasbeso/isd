
function AddRow() { 
    // todo: add functionality of using width to change element width dynamically as number of rows and columns increase
    var width = getComputedStyle(BOARD).getPropertyValue('--row-and-col-width')
    const number_of_rows = getComputedStyle(BOARD).getPropertyValue('--num-of-rows')
    const number_of_columns = getComputedStyle(BOARD).getPropertyValue('--num-of-cols')
    // Deletes old addrow button row
    BOARD.removeChild(BOARD.lastElementChild)
    // Creates the new row
    const new_row = document.createElement("div")
    new_row.classList.add("row")
    new_row.setAttribute('data-row', '')
    // data-live attribute stores whether row is live for iterated dominance algorithm
    new_row.setAttribute('data-row-is-live', 'true')
    // Creates delete row button/row label 
    const row_label = String.fromCharCode(parseInt(number_of_rows) + ASCII_CODE_OF_A - 1)
    new_row.appendChild(MakeLeftSideDeleteButton(row_label))
    // Adds all input squares (elements) to row
    for (let i = 0; i < parseInt(number_of_columns) - 1; i++) {
        let new_element = MakeBoardElement()
        new_row.appendChild(new_element)
    }
    // Row node is appended into BOARD
    BOARD.appendChild(new_row)
    BOARD.style.setProperty('--num-of-rows', parseInt(number_of_rows) + 1)
    // Adds new row with addrow element
    const add_row_button_row = document.createElement("div")
    add_row_button_row.classList.add("row")
    add_row_button_row.appendChild(MakeAddRowButton())
    // Appends add_row_button_row to BOARD
    BOARD.appendChild(add_row_button_row)
    // disables addrow button if necessary
    if (parseInt(number_of_rows) >= MAX_NUMBER_OF_ROWS_AND_COLUMNS) {
        document.querySelector('[data-add-new-row-button]').disabled = true
    }
}

function AddCol() {
    // todo: same as in Addrow()
    var width = getComputedStyle(BOARD).getPropertyValue('--row-and-col-width')
    const number_of_columns = getComputedStyle(BOARD).getPropertyValue('--num-of-cols')
    // Deletes old addcolumn button
    const delete_buttons_row = document.querySelector('[data-delete-buttons-row]')
    delete_buttons_row.removeChild(delete_buttons_row.lastElementChild)
    // Creates delete column button and appends to first row
    const column_label = String.fromCharCode(parseInt(number_of_columns) + ASCII_CODE_OF_a - 1)
    delete_buttons_row.appendChild(MakeTopDeleteButton(column_label))
    // adds new addcolumn element
    delete_buttons_row.appendChild(MakeAddColumnButton())
    // appends a new input square (element) to each row
    const rows = document.querySelectorAll('[data-row]')
    rows.forEach( row => {
        let new_element = MakeBoardElement()
        row.appendChild(new_element)
    })
    BOARD.style.setProperty('--num-of-cols', parseInt(number_of_columns) + 1)
    // Disables addcol button if necessary
    if (parseInt(number_of_columns) >= MAX_NUMBER_OF_ROWS_AND_COLUMNS) {
        document.querySelector('[data-add-new-col-button]').disabled = true
    }
}

function MakeBoardElement() {
    const element = document.createElement("div")
    element.classList.add("board-element") 
    element.dataset.boardElement = ""
    element.insertAdjacentHTML('beforeend', '<div></div>')

    const col_div = document.createElement("div")
    col_div.dataset.playerBackgroundColor = "col"
    col_div.style.backgroundColor = COL_PLAYER_COLOR
    col_div.insertAdjacentHTML('beforeend', '<input class="small-input" data-col-player-input="live" size="1"></input>')
    element.appendChild(col_div)

    const row_div = document.createElement("div")
    row_div.dataset.playerBackgroundColor = "row"
    row_div.style.backgroundColor = ROW_PLAYER_COLOR
    row_div.insertAdjacentHTML('beforeend', '<input class="small-input" data-row-player-input="live" size="1"></input>')
    element.appendChild(row_div)

    const blendiv = document.createElement("div")
    blendiv.dataset.playerBackgroundColor = "blend"
    blendiv.style.backgroundColor = BLEND_COLOR
    element.appendChild(blendiv)

    return element
}

// Returns a delete row button element
function MakeLeftSideDeleteButton(label) {
    const element = document.createElement("div")
    element.dataset.deleteRowDiv = ""
    element.insertAdjacentHTML('beforeend', `<button class="delete-btn row-color" style="background-color: ${ROW_PLAYER_COLOR};" data-delete-row-button><span>${label}</span></button>`)
    element.classList.add("horisontal-align")

    element.firstChild.addEventListener('click', () => {
        DeleteRow(element)
    })

    return element
}

// Returns a delete column button element
function MakeTopDeleteButton(label) {
    const element = document.createElement("div")
    element.dataset.colIsLive = "true"
    element.dataset.deleteColDiv = ""
    element.insertAdjacentHTML('beforeend', `<button class="delete-btn col-color" style="background-color: ${COL_PLAYER_COLOR};" data-delete-column-button><span>${label}</span></button>`)
    element.classList.add("vertical-align")

    element.firstChild.addEventListener('click', () => {
        DeleteColumn(element)
    })

    return element
}

function DeleteColumn(col_delete_div , validate=true) {
    const element = col_delete_div
    const number_of_columns = getComputedStyle(BOARD).getPropertyValue('--num-of-cols')
        if (number_of_columns <= 3 && validate) return
        const element_index = Array.from(element.parentNode.children).indexOf(element) 
        var rows = document.querySelectorAll('[data-row]')
        rows.forEach( row => {
            row.removeChild(row.childNodes[parseInt(element_index)])
        })
        BOARD.style.setProperty('--num-of-cols', parseInt(number_of_columns) - 1)
        document.querySelector('[data-add-new-col-button]').disabled = false
        element.remove()
        RenameAllColumns()
}

function DeleteRow(row_delete_div , validate=true) {
    const element = row_delete_div
    const number_of_rows = getComputedStyle(BOARD).getPropertyValue('--num-of-rows')
        if (number_of_rows <= 3 && validate) return
        BOARD.removeChild(element.parentNode)

        BOARD.style.setProperty('--num-of-rows', parseInt(number_of_rows) - 1)
        document.querySelector('[data-add-new-row-button]').disabled = false
        RenameAllRows()
}

function MakeAddRowButton() {
    const element = document.createElement("div")
    element.insertAdjacentHTML('beforeend', '<button onclick="AddRow()" class="add-btn" data-add-new-row-button>+</button>')
    element.classList.add("horisontal-align")

    return element
}

function MakeAddColumnButton() {
    const element = document.createElement("div")
    element.insertAdjacentHTML('beforeend', '<button onclick="AddCol()" class="add-btn" data-add-new-col-button>+</button>')
    element.classList.add("vertical-align")

    return element
}

function RenameAllRows() {
    const all_delete_row_buttons = document.querySelectorAll('[data-delete-row-button]')
    for (let i = 0; i < all_delete_row_buttons.length; i++) {
        all_delete_row_buttons[i].firstChild.innerHTML = String.fromCharCode(ASCII_CODE_OF_A + i)
    }
}

function RenameAllColumns() {
    const all_delete_column_buttons = document.querySelectorAll('[data-delete-column-button]')
    for (let i = 0; i < all_delete_column_buttons.length; i++) {
        all_delete_column_buttons[i].firstChild.innerHTML = String.fromCharCode(ASCII_CODE_OF_a + i)
    }
}

function clearOutput() {
    const output_div = document.querySelector('[data-output-div]')

    output_div.innerHTML = "<h4>Outputs:</h4>"
}
