import app from '@functions/handler/app';
import fs from 'fs';

app.ready(err => {
    if (err) throw err;
    const swaggerDocument = app.swagger({ yaml: true });
    console.log(swaggerDocument)
    // write swagger file to a docs folder in the root of the project
    fs.writeFileSync(`${__dirname}/../../docs/swagger.yaml`, swaggerDocument);
    console.log('swagger file generated');
});
