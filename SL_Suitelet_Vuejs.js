/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define (["N/ui/serverWidget","N/file", "N/render","N/search"] , function (serverWidget,file,render,search){
    
    function getHTMLTemplate(htmlpage , htmlLogic){
     const htmlpagedata = {} 
     search.create({
        type: 'file',
        filters: [['name','is',htmlpage], 'OR' , ['name' , 'is' , htmlLogic]],
        columns: ['name','url']
     }).run().each( resultSet => {
        htmlpagedata[resultSet.getValue({ name: "name" })] = {
            url: resultSet.getValue({ name: "url"}),
            id: resultSet.id
        }
        return true
     })   
     return htmlpagedata
    }
    
    function onRequest(context){

        const pageRenderer = render.create()
        const htmlFileData = getHTMLTemplate("Vuetify_form.html" , "Vuetify_form_logic.js")
        const htmlfile = file.load({
            id: htmlFileData["Vuetify_form.html"].id
        })
        pageRenderer.templateContent = htmlfile.getContents() 
        pageRenderer.addCustomDataSource({
            format: render.DataSource.OBJECT,
            alias: 'JSON',
            data: {
                files: {
                    componentLogic: htmlFileData['Vuetify_form_logic.js'].url
                }
            }
        })
        context.response.write(pageRenderer.renderAsString())
    }   
    return {
        onRequest : onRequest
    }
})