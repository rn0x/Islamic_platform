export default async (param) => {

    param.app.get('/test', async (request, response) => {

        console.log(param.config);
        let options = {
            title: "عنوان الصفحة",
            test: "تجريبي تجريبي"
        };
        let pugPath = param.path.join(param.__dirname, './views/test.pug');
        let render = param.pug.renderFile(pugPath, { options: options, jsStringify: param.jsStringify });
        response.send(render);
    });
}