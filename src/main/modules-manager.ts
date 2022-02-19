import type Module from './modules/module-model';

export const init = async (...modules: Module[]) => {
  await Promise.all(
    modules.map((module) =>
      module
        .init()
        .then(() => {
          console.log(`${module.constructor.name} was loaded successfully`);
        })
        .catch((err) => {
          throw err;
        })
    )
  ).catch((err) => {
    console.error(`[ERROR] An error occurred: ${err}`);
  });
};
