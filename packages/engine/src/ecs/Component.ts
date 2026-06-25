/**
 * Components are plain data objects attached to entities.
 * They should have no methods — just data fields.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Component {}

/** Constructor type for component classes — used for ECS queries */
export type ComponentConstructor<T extends Component = Component> = new (...args: never[]) => T;
