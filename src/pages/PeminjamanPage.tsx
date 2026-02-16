import { useEffect, useState } from 'react';
import { Peminjaman, PeminjamanDto } from '../types/Peminjaman';
import * as service from '../services/peminjamanService';

const defaultForm: PeminjamanDto = {
  namaPeminjam: '',
  nomorRuangan: '',
  tanggalPinjam: '',
  tanggalKembali: '',
  keperluan: '',
  status: 'menunggu',
};

export default function PeminjamanPage() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [form, setForm] = useState<PeminjamanDto>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const result = await service.getAll(search);
      setData(result);
    } catch {
      setError('Gagal memuat data');
    }
  };

  useEffect(() => { fetchData(); }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await service.update(editId, form);
      } else {
        await service.create(form);
      }
      setForm(defaultForm);
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch {
      setError('Gagal menyimpan data');
    }
    setLoading(false);
  };

  const handleEdit = (item: Peminjaman) => {
    setForm({
      namaPeminjam: item.namaPeminjam,
      nomorRuangan: item.nomorRuangan,
      tanggalPinjam: item.tanggalPinjam.slice(0, 16),
      tanggalKembali: item.tanggalKembali.slice(0, 16),
      keperluan: item.keperluan,
      status: item.status,
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await service.remove(id);
      fetchData();
    } catch {
      setError('Gagal menghapus data');
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await service.updateStatus(id, status);
      fetchData();
    } catch {
      setError('Gagal mengubah status');
    }
  };

  const statusColor = (status: string) => {
    if (status === 'disetujui') return '#28a745';
    if (status === 'ditolak') return '#dc3545';
    return '#ffc107';
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#1F4E79', borderBottom: '3px solid #2E75B6', paddingBottom: 8 }}>
        Sistem Peminjaman Ruangan Kampus
      </h1>

      {error && (
        <div style={{ background: '#f8d7da', color: '#842029', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          {error} <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Cari nama atau ruangan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
        />
        <button
          onClick={() => { setShowForm(!showForm); setForm(defaultForm); setEditId(null); }}
          style={{ padding: '10px 20px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
        >
          {showForm ? 'Batal' : '+ Tambah'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 24, border: '1px solid #dee2e6' }}>
          <h3 style={{ marginTop: 0, color: '#1F4E79' }}>{editId ? 'Edit Peminjaman' : 'Tambah Peminjaman'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 'bold' }}>Nama Peminjam *</label>
              <input required value={form.namaPeminjam} onChange={e => setForm({ ...form, namaPeminjam: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 'bold' }}>Nomor Ruangan *</label>
              <input required value={form.nomorRuangan} onChange={e => setForm({ ...form, nomorRuangan: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 'bold' }}>Tanggal Pinjam *</label>
              <input required type="datetime-local" value={form.tanggalPinjam} onChange={e => setForm({ ...form, tanggalPinjam: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 'bold' }}>Tanggal Kembali *</label>
              <input required type="datetime-local" value={form.tanggalKembali} onChange={e => setForm({ ...form, tanggalKembali: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 'bold' }}>Keperluan</label>
              <textarea value={form.keperluan} onChange={e => setForm({ ...form, keperluan: e.target.value })}
                rows={3} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 'bold' }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }}>
                <option value="menunggu">Menunggu</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading}
              style={{ padding: '10px 24px', background: '#1F4E79', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              {loading ? 'Menyimpan...' : editId ? 'Update' : 'Simpan'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setForm(defaultForm); setEditId(null); }}
              style={{ padding: '10px 24px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              Batal
            </button>
          </div>
        </form>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#1F4E79', color: '#fff' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>No</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nama Peminjam</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Ruangan</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tanggal Pinjam</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tanggal Kembali</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Keperluan</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: '#888' }}>Tidak ada data peminjaman</td></tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} style={{ background: index % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px 16px' }}>{index + 1}</td>
                  <td style={{ padding: '10px 16px' }}>{item.namaPeminjam}</td>
                  <td style={{ padding: '10px 16px' }}>{item.nomorRuangan}</td>
                  <td style={{ padding: '10px 16px' }}>{new Date(item.tanggalPinjam).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '10px 16px' }}>{new Date(item.tanggalKembali).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '10px 16px' }}>{item.keperluan || '-'}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <select value={item.status} onChange={e => handleStatusChange(item.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: statusColor(item.status), color: item.status === 'menunggu' ? '#000' : '#fff', cursor: 'pointer' }}>
                      <option value="menunggu">Menunggu</option>
                      <option value="disetujui">Disetujui</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px 16px' }}>
                    <button onClick={() => handleEdit(item)}
                      style={{ padding: '6px 12px', background: '#2E75B6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 6 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}