import { Timber } from "@timberio/node";
import { ITimberOptions, LogLevel } from "@timberio/types";
import Koa, { Context } from "koa";
import { path } from "rambda";

interface IKoaOptions {
  /**
   * Properties to pluck from the Koa `Context` object
   */
  contextPaths: string[];
}

const defaultKoaOpt: IKoaOptions = {
  contextPaths: [
    "statusCode",
    "request.headers",
    "request.method",
    "request.length",
    "request.url",
    "request.query"
  ]
};

class KoaTimber extends Timber {
  protected _koaOptions: IKoaOptions;

  public constructor(
    apiKey: string,
    timberOpt?: Partial<ITimberOptions>,
    koaOpt?: Partial<IKoaOptions>
  ) {
    super(apiKey, timberOpt);

    // Set Koa-specific logging options
    this._koaOptions = { ...defaultKoaOpt, ...koaOpt };
  }

  /**
   * Returns an object containing Koa request data, from Context
   * @param ctx - Koa Context
   */
  private _fromContext(ctx: Context) {
    return {
      context: {
        ...this._koaOptions.contextPaths.map(p => ({
          [p]: path(p, ctx)
        }))
      }
    };
  }

  /**
   * Koa middleware handler
   *
   * @param ctx - Koa context
   * @param next - Function to invoke the next middleware in the pipeline
   */
  private middleware = async (ctx: Context, next: () => Promise<void>) => {
    // By default, use the 'info' log level
    let logLevel: LogLevel = LogLevel.Info;

    let msg: string;

    try {
      // Call downstream middleware
      await next();

      // If not thrown, middleware executed successfully
      msg = `Koa HTTP request: ${ctx.status}`;

      // 4xx | 5xx status codes should be considered a warning
      if (ctx.status.toString().startsWith("4")) {
        logLevel = LogLevel.Warn;
      } else if (ctx.status.toString().startsWith("5")) {
        logLevel = LogLevel.Error;
      }
    } catch (e) {
      // Error was thrown in middleware / HTTP request handling
      logLevel = LogLevel.Error;
      msg = `Koa HTTP request error: ${(typeof e === "object" && e.message) ||
        e}`;
    } finally {
      // Finally, log to the correct log level
      void this[logLevel](msg!, this._fromContext(ctx));
    }
  };

  /**
   * Attach Timber's Koa middleware handler to a Koa instance
   *
   * @param koa - an instance of Koa
   */
  public attach(koa: Koa): this {
    koa.use(this.middleware);
    return this;
  }
}

export default KoaTimber;
