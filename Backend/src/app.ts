//Under development

import { PORT, app, createDB } from "./config";

const startApp = async (p: string) => {
    await createDB();
    return app.listen(p, () => {
        console.log(`server is listening on port ${p}`);
    });
};

startApp(PORT);
