import React, { useState } from 'react'
/*importa react, obrigatório pra jsx e usa 
hook useState pra estado interno do componente. O useState guarda usuário e senha 
num storeage (função setState) e navega pra home com useNavigate*/

import { useNavigate, Link } from 'react-router-dom'
// Importa useNavigate para mudar de rota via código, e Link (que aqui não é usado).

import { setState } from '../lib/storage'
// Importa uma função utilitária para salvar dados (provavelmente em localStorage).
// Não é do react

import Mascot from '../components/Mascot'
// Importa um componente visual do mascote

export default function Login(){
  // Define e exporta o componente de função "Login".

  const nav = useNavigate()
    // Pega a função de navegação do React Router.

  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  // Cria dois estados controlados: "name" e "pass".
  // O valor inicial é string vazia. setName/setPass atualizam esses valores.
  const [err, setErr] = useState('') //Constante de erro

  function handleSubmit(e){
    e.preventDefault()
  // Impede o comportamento padrão do <form> (recarregar a página).
      
    if (!name.trim()) { 
      setErr('Por favor, informe o usuário!');
       return 
      }
  
   // Se o nome estiver vazio (ou só espaços), exige.
   if (!pass) { 
    setErr('Por favor, informe a senha!'); 
    return
   }
   //Exige senha

    setState({ user:{ name, email:`${name}@demo` }, coins:0, xp:0 })
    // Salva um "estado global" simples do usuário.
    // Aqui cria um usuário com nome e um e-mail fake (name@demo) e zera moedas/xp.
    // Isso é um mock de login — não há verificação real de senha.

    nav('/home')
    // Redireciona para a rota /home.

  }

  return (
  // Tudo abaixo é JSX (parece HTML, mas é JS gerando elementos React).

    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'20px auto'}}>
        <h1 className="header-title">JavaLingo</h1>

        <div style={{display:'grid',placeItems:'center',margin:'14px 0 18px'}}>
          <div className="avatar">
            <Mascot skin="classic" size={160}/>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="input-row">
          {err && <p className="small" style={{color:'crimson',textAlign:'center',marginBottom:8}}>{err}</p>}
          <input className="input" placeholder="Usuário" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" placeholder="Senha" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
         <button className="btn btn-primary btn-full btn-lg" disabled={!name.trim()}>
         </button>
          <p className="small" style={{textAlign:'center'}}>
          <Link to="/signup">Cadastrar-se</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
