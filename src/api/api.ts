import axios, { AxiosRequestConfig } from 'axios';

import { baseUrl, manualApiDelay, manualShortApiDelay } from '../constants';
import {
  Environment,
  Invoice,
  InvoiceAttachment,
  InvoicePackingSlip,
  InvoicesToApprove,
  Login,
  Paging,
  User,
} from './types';

const config: AxiosRequestConfig = { baseURL: baseUrl };
export const axiosInstance = axios.create(config);

const apiDelay = async (delay: number = manualApiDelay): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export const login = async function (username: string, password: string): Promise<Login> {
  await apiDelay();

  const { data } = await axiosInstance.post('/auth/login', {
    password,
    username,
  });

  return { firstName: data.firstName, token: data.token };
};

export const getTotalInvoices = async (_token: string, _environmentId: string): Promise<number> => {
  await apiDelay();

  return 100;
};

const buildPaging = (total: number, current: number, max: number, page: number): Paging => {
  const currentPageNr = (current / max) + 1;
  const totalPageNrs = total / max;
  return {
    current: currentPageNr,
    next: currentPageNr < totalPageNrs ? currentPageNr + 1 : undefined,
    previous: currentPageNr > 1 ? page - 1 : undefined,
    total: totalPageNrs,
    totalResults: total,
  };
};

export const getInvoicesToApprove = async (
  token: string,
  environmentId: string,
  page: number,
  max = 25,
): Promise<InvoicesToApprove> => {
  await apiDelay();

  const current = max * (page - 1);
  const { data = [] } = await axiosInstance.get(
    `/products?limit=${max}&skip=${current}&select=id,title,price&envId=${environmentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  // mockup method to generate a random date
  const getRandomDateInBetween = (startDate: Date, endDate: Date): Date => {
    return new Date(Math.floor(Math.random() * (endDate.getTime() - startDate.getTime() + 1) + startDate.getTime()));
  };

  const paging = buildPaging(data.total, data.skip, max, page);
  const invoices = data.products.map((row: any) => ({
    companyName: row.title,
    date: getRandomDateInBetween(new Date(), new Date('2010-01-01')),
    deadlineDate: new Date(),
    id: row.id,
    invoiceNr: String(row.id).padStart(10, '0'),
    price: row.price,
    status: row.id,
  }));

  return { invoices, paging };
};

export const getEnvironments = async (_token: string): Promise<Environment[]> => {
  await apiDelay();

  return [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'Environment 1',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: 'Environment 2',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: 'Environment 3',
    },
  ];
};

export const getInvoiceDetails = async (_token: string, _environmentId: string, id: string): Promise<Invoice> => {
  await apiDelay(manualShortApiDelay);

  return {
    companyName: 'We Create Solutions B.V',
    companySubTitle: 'Blue10 bedrijf',
    entryNumber: '21600035',
    expirationDate: '22 03 2021',
    id,
    invoiceDate: '18 03 2021',
    invoiceNumber: '2678',
    paymentCondition: '4 weken',
    paymentDate: '-',
    status: 'Geboekt',
    subtotal: '20.000.000,-',
    totalToPay: '€ 24.200.000,-',
    vatTotal: '4.200.000,-',
  };
};

export const getUsers = async (_token: string, _environmentId: string): Promise<User[]> => {
  await apiDelay(manualShortApiDelay);

  return [
    {
      id: '1',
      name: 'Bart spruijt',
    },
    {
      id: '2',
      name: 'Guido van Deursen',
    },
    {
      id: '3',
      name: 'Robet kerssing',
    },
  ];
};

export const getInvoiceAttachments = async (
  _token: string,
  _environmentId: string,
  _id: string,
): Promise<InvoiceAttachment[]> => {
  await apiDelay(manualShortApiDelay);

  return [
    {
      fileSize: 121400,
      id: '1',
      name: 'Factuur-20221103.pdf',
    },
    {
      fileSize: 82635,
      id: '2',
      name: 'Factuur-20221103 (1).pdf',
    },
    {
      fileSize: 140159120,
      id: '3',
      name: 'Factuur-20221103 (2).pdf',
    },
  ];
};

export const getInvoicePackingSlips = async (
  _token: string,
  _environmentId: string,
  _id: string,
): Promise<InvoicePackingSlip[]> => {
  await apiDelay(manualShortApiDelay);

  return [
    {
      fileSize: 121400,
      id: '1',
      name: 'Pakbon-20221103.pdf',
    },
    {
      fileSize: 82635,
      id: '2',
      name: 'Pakbon-20221103 (1).pdf',
    },
    {
      fileSize: 140159120,
      id: '3',
      name: 'Pakbon-20221103 (2).pdf',
    },
  ];
};

export const getInvoiceBookings = async (
  _token: string,
  _environmentId: string,
  _id: string,
): Promise<InvoicePackingSlip[]> => {
  await apiDelay(manualShortApiDelay);

  return [
    {
      fileSize: 121400,
      id: '1',
      name: 'Boeking-20221103.pdf',
    },
    {
      fileSize: 82635,
      id: '2',
      name: 'Boeking-20221103 (1).pdf',
    },
    {
      fileSize: 140159120,
      id: '3',
      name: 'Boeking-20221103 (2).pdf',
    },
  ];
};

export const getInvoiceTimeline = async (
  _token: string,
  _environmentId: string,
  _id: string,
): Promise<InvoicePackingSlip[]> => {
  await apiDelay(manualShortApiDelay);

  return [
    {
      fileSize: 121400,
      id: '1',
      name: 'Timeline-20221103.pdf',
    },
    {
      fileSize: 82635,
      id: '2',
      name: 'Timeline-20221103 (1).pdf',
    },
    {
      fileSize: 140159120,
      id: '3',
      name: 'Timeline-20221103 (2).pdf',
    },
  ];
};
