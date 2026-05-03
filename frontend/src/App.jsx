import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BOOKS_URL = `${API_BASE}/books`;
const MEMBERS_URL = `${API_BASE}/members`;
const ISSUES_URL = `${API_BASE}/issues`;

const emptyBookForm = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  totalCopies: 1,
  availableCopies: 1
};

const emptyMemberForm = {
  name: '',
  email: '',
  membershipId: '',
  phone: '',
  active: true
};

function App() {
  const [activeTab, setActiveTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState(emptyBookForm);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [issueNotes, setIssueNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get(BOOKS_URL);
      setBooks(data);
    } catch (err) {
      setError('Failed to load books. Make sure the backend is running.');
    }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await axios.get(MEMBERS_URL);
      setMembers(data);
    } catch (err) {
      setError('Failed to load members.');
    }
  };

  const fetchIssues = async () => {
    try {
      const { data } = await axios.get(ISSUES_URL);
      setIssues(data);
    } catch (err) {
      setError('Failed to load issue history.');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchMembers();
    fetchIssues();
  }, []);

  const handleBookChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name.includes('Copies') ? Number(value) : value
    }));
  };

  const handleMemberChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMemberForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitBook = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingBookId) {
        await axios.put(`${BOOKS_URL}/${editingBookId}`, form);
      } else {
        await axios.post(BOOKS_URL, form);
      }
      setForm(emptyBookForm);
      setEditingBookId(null);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save book.');
    }
  };

  const handleSubmitMember = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (editingMemberId) {
        await axios.put(`${MEMBERS_URL}/${editingMemberId}`, memberForm);
      } else {
        await axios.post(MEMBERS_URL, memberForm);
      }
      setMemberForm(emptyMemberForm);
      setEditingMemberId(null);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save member.');
    }
  };

  const handleEditBook = (book) => {
    setEditingBookId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    });
    setActiveTab('books');
  };

  const handleEditMember = (member) => {
    setEditingMemberId(member._id);
    setMemberForm({
      name: member.name,
      email: member.email,
      membershipId: member.membershipId,
      phone: member.phone,
      active: member.active
    });
    setActiveTab('members');
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Delete this book permanently?')) return;
    await axios.delete(`${BOOKS_URL}/${id}`);
    fetchBooks();
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Delete this member permanently?')) return;
    await axios.delete(`${MEMBERS_URL}/${id}`);
    if (selectedMemberId === id) {
      setSelectedMemberId('');
    }
    fetchMembers();
  };

  const handleCheckout = async (bookId) => {
    if (!selectedMemberId) {
      setError('Select a member before checking out a book.');
      return;
    }
    setError('');
    try {
      await axios.post(`${ISSUES_URL}/checkout`, {
        bookId,
        memberId: selectedMemberId,
        notes: issueNotes
      });
      setIssueNotes('');
      fetchBooks();
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to checkout book.');
    }
  };

  const handleReturn = async (bookId) => {
    if (!selectedMemberId) {
      setError('Select a member before returning a book.');
      return;
    }
    setError('');
    try {
      await axios.post(`${ISSUES_URL}/return`, {
        bookId,
        memberId: selectedMemberId,
        notes: issueNotes
      });
      setIssueNotes('');
      fetchBooks();
      fetchIssues();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to return book.');
    }
  };

  const resetBookForm = () => {
    setForm(emptyBookForm);
    setEditingBookId(null);
    setError('');
  };

  const resetMemberForm = () => {
    setMemberForm(emptyMemberForm);
    setEditingMemberId(null);
    setError('');
  };

  return (
    <div className="app-container">
      <header>
        <h1>Library Management System</h1>
        <p>Manage books, members, and checkout history in one MERN app.</p>
      </header>

      <nav className="tab-list">
        <button className={`tab-button ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')}>
          Books
        </button>
        <button className={`tab-button ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
          Members
        </button>
        <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Issue History
        </button>
      </nav>

      {error && <p className="error-message">{error}</p>}

      <main>
        {activeTab === 'books' && (
          <>
            <section className="form-section">
              <h2>{editingBookId ? 'Edit Book' : 'Add New Book'}</h2>
              <form onSubmit={handleSubmitBook} className="book-form">
                <label>
                  Title
                  <input name="title" value={form.title} onChange={handleBookChange} required />
                </label>
                <label>
                  Author
                  <input name="author" value={form.author} onChange={handleBookChange} required />
                </label>
                <label>
                  ISBN
                  <input name="isbn" value={form.isbn} onChange={handleBookChange} required />
                </label>
                <label>
                  Category
                  <input name="category" value={form.category} onChange={handleBookChange} placeholder="e.g. Fiction" />
                </label>
                <label>
                  Total Copies
                  <input name="totalCopies" type="number" min="1" value={form.totalCopies} onChange={handleBookChange} required />
                </label>
                <label>
                  Available Copies
                  <input name="availableCopies" type="number" min="0" value={form.availableCopies} onChange={handleBookChange} required />
                </label>
                <div className="form-actions">
                  <button type="submit">{editingBookId ? 'Update Book' : 'Add Book'}</button>
                  <button type="button" className="secondary" onClick={resetBookForm}>Clear</button>
                </div>
              </form>
            </section>

            <section className="form-section member-actions">
              <h2>Checkout / Return</h2>
              <label>
                Member
                <select value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
                  <option value="">Select member</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.membershipId})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Notes (optional)
                <input value={issueNotes} onChange={(event) => setIssueNotes(event.target.value)} placeholder="Remarks for this action" />
              </label>
              <p className="small-text">Select a member to issue or return a book. If no members exist, add one in the Members tab.</p>
            </section>

            <section className="table-section">
              <h2>Book Inventory</h2>
              {books.length === 0 ? (
                <p>No books available. Add one to get started.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Available</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book._id}>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td>{book.isbn}</td>
                          <td>{book.category}</td>
                          <td>{book.availableCopies}/{book.totalCopies}</td>
                          <td>{book.status}</td>
                          <td>
                            <button onClick={() => handleEditBook(book)}>Edit</button>
                            <button className="danger" onClick={() => handleDeleteBook(book._id)}>Delete</button>
                            <button disabled={book.availableCopies <= 0 || !selectedMemberId} onClick={() => handleCheckout(book._id)}>
                              Checkout
                            </button>
                            <button disabled={!selectedMemberId} onClick={() => handleReturn(book._id)}>
                              Return
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'members' && (
          <>
            <section className="form-section">
              <h2>{editingMemberId ? 'Edit Member' : 'Add New Member'}</h2>
              <form onSubmit={handleSubmitMember} className="book-form">
                <label>
                  Name
                  <input name="name" value={memberForm.name} onChange={handleMemberChange} required />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={memberForm.email} onChange={handleMemberChange} required />
                </label>
                <label>
                  Membership ID
                  <input name="membershipId" value={memberForm.membershipId} onChange={handleMemberChange} required />
                </label>
                <label>
                  Phone
                  <input name="phone" value={memberForm.phone} onChange={handleMemberChange} />
                </label>
                <label className="checkbox-label">
                  <input name="active" type="checkbox" checked={memberForm.active} onChange={handleMemberChange} />
                  Active member
                </label>
                <div className="form-actions">
                  <button type="submit">{editingMemberId ? 'Update Member' : 'Add Member'}</button>
                  <button type="button" className="secondary" onClick={resetMemberForm}>Clear</button>
                </div>
              </form>
            </section>

            <section className="table-section">
              <h2>Members</h2>
              {members.length === 0 ? (
                <p>No members yet. Add members to issue books.</p>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Membership ID</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member._id}>
                          <td>{member.name}</td>
                          <td>{member.email}</td>
                          <td>{member.membershipId}</td>
                          <td>{member.phone}</td>
                          <td>{member.active ? 'Active' : 'Inactive'}</td>
                          <td>
                            <button onClick={() => handleEditMember(member)}>Edit</button>
                            <button className="danger" onClick={() => handleDeleteMember(member._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'history' && (
          <section className="table-section">
            <h2>Issue History</h2>
            {issues.length === 0 ? (
              <p>No actions recorded yet.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Book</th>
                      <th>Member</th>
                      <th>Action</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((item) => (
                      <tr key={item._id}>
                        <td>{new Date(item.date).toLocaleString()}</td>
                        <td>{item.book?.title || 'Unknown'}</td>
                        <td>{item.member?.name || 'Unknown'}</td>
                        <td>{item.action}</td>
                        <td>{item.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
