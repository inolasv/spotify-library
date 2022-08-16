


// Gets rid of repeated code by catching errors and console logging them.
export const catchErrors = (fn) =>{
    return function(...args) {
        return fn(...args).catch((err) => {
            console.error(err);
        });
    }
}