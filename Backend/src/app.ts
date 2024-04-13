//Under development

import { PORT, app, createDB } from "./config";

const startApp = async (port: string) => {
    await createDB();
    return app.listen(port, () => {
        console.log(`server is listening on port ${port}`);
    });
};

startApp(PORT);
