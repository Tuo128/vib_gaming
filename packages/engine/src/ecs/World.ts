import type { Entity } from './Entity';
import type { Component, ComponentConstructor } from './Component';
import type { System } from './System';
import { EventBus } from '../core/EventBus';

/**
 * Result of a component query.
 * Returns a tuple array: [entity, component1, component2, ...]
 * Use array destructuring: for (const [entity, transform, velocity] of results)
 */
export type QueryResult<C extends Component[]> = Array<[Entity, ...C]>;

/**
 * ECS World container.
 * Manages entities, their components, and systems.
 */
export class World {
  private nextId = 1;
  private entityComponents = new Map<Entity, Map<ComponentConstructor, Component>>();
  private systems: System[] = [];
  public readonly events = new EventBus();

  /** Create a new entity and return its ID */
  createEntity(): Entity {
    const id = this.nextId++;
    this.entityComponents.set(id, new Map());
    return id;
  }

  /** Remove an entity and all its components */
  removeEntity(entity: Entity): void {
    this.entityComponents.delete(entity);
  }

  /** Check if an entity exists */
  hasEntity(entity: Entity): boolean {
    return this.entityComponents.has(entity);
  }

  /** Attach a component to an entity */
  addComponent<T extends Component>(entity: Entity, comp: T): void {
    const comps = this.entityComponents.get(entity);
    if (!comps) {
      throw new Error(`Entity ${entity} does not exist`);
    }
    comps.set(comp.constructor as ComponentConstructor, comp);
    this.events.emit('componentAdded', { entity, component: comp });
  }

  /** Get a component from an entity */
  getComponent<T extends Component>(entity: Entity, type: ComponentConstructor<T>): T | undefined {
    return this.entityComponents.get(entity)?.get(type) as T | undefined;
  }

  /** Check if an entity has a component */
  hasComponent(entity: Entity, type: ComponentConstructor): boolean {
    return this.entityComponents.get(entity)?.has(type) ?? false;
  }

  /** Remove a component from an entity */
  removeComponent(entity: Entity, type: ComponentConstructor): void {
    this.entityComponents.get(entity)?.delete(type);
  }

  /**
   * Query all entities that have ALL of the specified component types.
   * Returns an array of { entity, Component1, Component2, ... } objects.
   */
  query<C extends Component[]>(
    ...types: { [K in keyof C]: ComponentConstructor<C[K]> }
  ): QueryResult<C> {
    const results: QueryResult<C> = [];
    for (const [entity, comps] of this.entityComponents) {
      let hasAll = true;
      for (const type of types) {
        if (!comps.has(type)) {
          hasAll = false;
          break;
        }
      }
      if (hasAll) {
        const entry: unknown[] = [entity];
        for (const type of types) {
          entry.push(comps.get(type)!);
        }
        results.push(entry as QueryResult<C>[number]);
      }
    }
    return results;
  }

  /** Add a system to the world */
  addSystem(system: System): void {
    this.systems.push(system);
  }

  /** Remove a system from the world */
  removeSystem(system: System): void {
    const idx = this.systems.indexOf(system);
    if (idx >= 0) this.systems.splice(idx, 1);
  }

  /** Update all systems. dt is in seconds. */
  update(dt: number): void {
    for (const system of this.systems) {
      if (system.enabled) {
        system.update(dt, this);
      }
    }
  }

  /** Remove all entities and systems */
  clear(): void {
    this.entityComponents.clear();
    this.systems.length = 0;
    this.events.clear();
    this.nextId = 1;
  }

  /** Get the total number of entities */
  get entityCount(): number {
    return this.entityComponents.size;
  }
}
