import type { HostListResponse, HostResponse } from '@extratime/shared';
import type { Request, Response } from 'express';
import { NotFoundError } from '../../http/domain-errors.js';
import { collectionBody, singleBody } from '../../http/response-envelope.js';
import type { HostsService } from './hosts.service.js';

/** GET /api/v1/hosts and /api/v1/hosts/:slug. */
export class HostsController {
  constructor(private readonly hosts: HostsService) {}

  /** Every host in editorial order. */
  readonly list = async (
    _request: Request,
    response: Response<HostListResponse>,
  ): Promise<void> => {
    response.json(collectionBody(await this.hosts.listHosts()));
  };

  /** The host profile with exactly this slug, else 404. */
  readonly getBySlug = async (
    request: Request<{ slug: string }>,
    response: Response<HostResponse>,
  ): Promise<void> => {
    const { slug } = request.params;
    const result = await this.hosts.getHostBySlug(slug);
    if (result === null) throw new NotFoundError(`No host matches the slug '${slug}'.`);
    response.json(singleBody(result));
  };
}
