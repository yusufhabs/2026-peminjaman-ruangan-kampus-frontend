export interface Peminjaman {
  id: number;
  namaPeminjam: string;
  nomorRuangan: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  keperluan: string;
  status: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface PeminjamanDto {
  namaPeminjam: string;
  nomorRuangan: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  keperluan: string;
  status: string;
}