/**
 * 持久层类
 */
export declare class Dao {
    static selectById<T>(entity: T): T | undefined;

    static selectList<T extends new (...args: any) => any>(clazz: T, sqlId: string, ...params: any): InstanceType<T>[];

    static selectPageList<T extends new (...args: any) => any>(clazz: T, sqlId: string, ...params: any): InstanceType<T>[];

    static insert<T>(entity: T): number;

    static insertBatch<T>(entityList: T[]): number;

    static updateById<T>(entity: T): number;

    static deleteById<T>(entity: T): number;

    static save<T>(sqlId: string, ...params: any): number;

    static remove<T>(sqlId: string, ...params: any): number;
}

/**
 * 搜索引擎帮助类
 */
export declare class ES {
    static query(url: string, body: any): any
}

/**
 * 服务器方法
 */
export declare namespace Server {
    export const version: string;

    /**
     * 线程休眠
     * @param millis
     */
    export function sleep(millis: number): void;

    /**
     * 在模块加载完成后，统一调用的函数
     */
    export function defer(f: Function, ...args);
}

/**
 * 工具方法
 */
export declare namespace Utils {

    /**
     * 获取某个实例类名
     */
    export function getClassName(v: any): void;

}

interface FieldOption {
    insertIgnore: boolean,
    updateIgnore: boolean
}

/**
 * 装饰实体关联的表格名
 */
export function TableName(name: string): Function;

/**
 * 装饰实体字段 关联的字段名
 */
export function TableField(name?: string, option?: FieldOption): Function;

/**
 * 装饰实体 关联的主键字段名
 */
export function IdField(name?: string, option?: FieldOption): Function;

/**
 * 标注服务 Service
 */
export const Service: Function;

/**
 * 标注持久层 Repository
 */
export const Repository: Function;

/**
 * 标注组件 Component
 */
export const Component: Function;

/**
 * 注入赋值 Autowired.
 */
export const Autowired: Function;

/**
 * 标注接口
 */
export const Api: Function;

/**
 * 事务注解
 */
export const Transactional: Function;

/**
 * 缓存启用
 */
export const Cacheable: Function;

/**
 * 标记缓存过期注解
 */
export const CacheEvict: Function;

/**
 * 含义注释
 */
export const Desc: Function;

/**
 * 大数值运算
 */
export declare class BigDecimal {

    static ZERO: BigDecimal;

    constructor(v: any)

    /**
     * 加
     */
    add(value: BigDecimal): BigDecimal;

    /**
     * 减
     */
    subtract(value: BigDecimal): BigDecimal;

    /**
     * 乘
     */
    multiply(value: BigDecimal): BigDecimal;

    /**
     * 除
     */
    divide(value: BigDecimal): BigDecimal;

    /**
     * 取整数
     */
    intValue(): number

    /**
     * 取小数
     */
    doubleValue(): number
}

/**
 * 日期类型
 */
export declare class JodaTime {

    static now(): JodaTime

    constructor();

    plusDays(delta: number)

    plusMonths(delta: number)

    plusHours(delta: number)

    plusMinutes(delta: number)

    plusSeconds(delta: number)

    plusMillis(delta: number)

    plusWeeks(delta: number)

    getMillis(): number

    toString(pattern: string): string
}

/**
 * 分页对象
 */
export declare class PageDb {

}

/**
 * 控制台
 */
declare namespace console {
    /**
     * 打印日志
     */
    export function log(...obj: any);

    /**
     * 调试参数
     */
    export function debugIt(...obj: any);

}