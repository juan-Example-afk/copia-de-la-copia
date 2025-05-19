export class UsuarioRepository {
  constructor() {
    this.usuarios = [];
  }

  async save(usuario) {
    // Si el usuario ya existe, actualizamos el objeto
    const index = this.usuarios.findIndex(u => u.email === usuario.email);
    if (index !== -1) {
      this.usuarios[index] = usuario;
    } else {
      this.usuarios.push(usuario);
    }
    return usuario;
  }

  async findByEmail(email) {
    return this.usuarios.find(u => u.email === email);
  }

  async findById(email) {
    //id = email
    return this.findByEmail(email);
  }

  async findAll() {
    return this.usuarios;
  }

  async deleteById(email) {
    // id = email
    const index = this.usuarios.findIndex(u => u.email === email);
    if (index === -1) return false;
    this.usuarios.splice(index, 1);
    return true;
  }

  async deleteByEmail(email) {
    return this.deleteById(email);
  }

  async findUsuario(usuario) {
    return this.findByEmail(usuario.email);
  }
}
