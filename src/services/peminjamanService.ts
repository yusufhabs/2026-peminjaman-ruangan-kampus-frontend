import axios from 'axios';
import { Peminjaman, PeminjamanDto } from '../types/Peminjaman';

const API_URL = 'http://localhost:5248/api/peminjaman';

export const getAll = async (search?: string): Promise<Peminjaman[]> => {
  const res = await axios.get(API_URL, { params: { search } });
  return res.data;
};

export const getById = async (id: number): Promise<Peminjaman> => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const create = async (data: PeminjamanDto): Promise<Peminjaman> => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const update = async (id: number, data: PeminjamanDto): Promise<Peminjaman> => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const remove = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const updateStatus = async (id: number, status: string): Promise<Peminjaman> => {
  const res = await axios.patch(`${API_URL}/${id}/status`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' }
  });
  return res.data;
};