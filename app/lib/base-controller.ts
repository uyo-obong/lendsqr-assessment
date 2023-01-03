import { get } from 'lodash';
import { Transformer } from './transformer/transform';

export class RestController {
  /**
   * Transform a object
   *
   * @param obj
   * @param transformer
   * @param options
   */
  async transform(
    obj: Record<string, any>,
    transformer: Transformer,
    options?: Record<string, any>,
  ): Promise<Record<string, any>> {
    transformer = this.setTransformerContext(transformer, options);

    return await transformer
      .parseIncludes(this.getIncludes(options?.req))
      .work(obj);
  }

  /**
   * Transform collection/array
   *
   * @param collect
   * @param transformer
   * @param options
   */
  async collection(
    collect: Array<Record<string, any>>,
    transformer: Transformer,
    options?: Record<string, any>,
  ): Promise<Array<Record<string, any>>> {
    transformer = this.setTransformerContext(transformer, options);

    const collection = [];
    for (const o of collect) {
      // console.log(this.getIncludes(options))
      collection.push(
        await transformer.parseIncludes(this.getIncludes(options)).work(o),
        // await transformer.parseIncludes(this.getIncludes(options?.req)).work(o),
      );
    }
    // console.log(collection);
    // console.log(this.getIncludes(options?.req))
    return collection;
  }

  /**
   * Transform with paginate
   * @param obj
   * @param transformer
   * @param options
   */
  async paginate(
    obj: Record<string, any>,
    transformer: Transformer,
    options?: Record<string, any>,
  ): Promise<Record<string, any>> {
    const collection = this.collection(obj.items, transformer, options);

    return {
      items: await collection,
      meta: obj.meta,
    };
  }

  private setTransformerContext(
    transformer: Transformer,
    options: Record<string, any>,
  ): Transformer {
    // add request object to the transformer's context
    transformer.ctx.setRequest(options?.req || {});
    return transformer;
  }

  getIncludes(req: any) {
    if (!req) return '';
    // console.log(get(req, 'include', ''));
    return req ?? '';
    // return get(req.all(), 'include', '');
  }
}
