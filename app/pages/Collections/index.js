import Page from '/app/classes/Page'

export default class Collections extends Page {
    constructor() {
        super({
            id: 'collections',
            element: '.collections'
        })
    }
}