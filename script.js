const {
	ref
} = Vue;

const app = Vue.createApp({
	data() {
		return {
			baseURL: "https://dadosabertos.camara.leg.br/api/v2/",
			tab: "assuntos",
			mostra_deputados: false,
			mostra_partidos: true,
			tabela_partidos: [],
			filtro_estado: "Todos",
			votacoes: [
				{
				  id: "2329218-162",
				  nome: "AUXÍLIO EMERGENCIAL PERMANENTE NO VALOR DE R$ 600",
				  desc: "PEC 15/2022",
				  verdadeiro: "Não",
				  falso: "Sim",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "2199763-83",
				  nome:
				    "TRABALHO AOS DOMINGOS E FERIADOS SEM PAGAMENTO ADICIONAL DA HORA TRABALHADA",
				  desc: "MP 881/2019",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "46249-297",
				  nome: "LIBERAÇÃO DE AGROTÓXICO NO PAÍS",
				  desc: "PL 6299/2002",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "257161-337",
				  nome: "FLEXIBILIZAÇÃO DO LICENCIAMENTO AMBIENTAL",
				  desc: "PL 3729/2004",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "2270789-73",
				  nome: "PRIVATIZAÇÃO DA ELETROBRÁS",
				  desc: "MP 1031/2021",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "2220292-229",
				  nome: "TORNAR OBRIGATÓRIO O VOTO IMPRESSO",
				  desc: "PEC 135/2019",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "534328-167",
				  nome: "REGULAMENTAÇÃO DO HOMESCHOOLING",
				  desc: "PL 3179/2012",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "2313734-73",
				  nome: "VOLTA DO DESPACHO GRATUITO DE BAGAGEM EM VOOS",
				  desc: "MP 1089/2021",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "15460-165",
				  nome: "LEGALIZAÇÃO DOS 'JOGOS DE AZAR'",
				  desc: "PL 442/1991",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "2184458-172",
				  nome: "FLEXIBILIZAÇÃO DE REGRAS CONTRA O NEPOTISMO",
				  desc: "PL 2505/2021",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "2275537-128",
				  nome: "ENFRAQUECIMENTO DO MINITÉRIO PÚBLICO",
				  desc: "PEC 5/2021",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "2288389-98",
				  nome: "TRIBUTAÇÃO DE LUCROS E DIVIDENDOS",
				  desc: "PL 2337/2021",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				},
				{
				  id: "1301128-43",
				  nome: "TIPIFICAÇÃO DE INJÚRIA RACIAL COMO RACISMO",
				  desc: "PL 4373/2020",
				  verdadeiro: "Sim",
				  falso: "Não",
				  valor: ref(null),
				  votacao: []
				}
			]
		};



	},
	watch: {
		votacoes: {
			handler: (newValue, oldValue) => {
				self.localStorage.setItem("votacoes", JSON.stringify(newValue));
			},
			deep: true
		},

		filtro_estado: (newValue, oldValue) => {
			self.localStorage.setItem("filtro_estado", newValue);
		},
		mostra_deputados: (newValue, oldValue) => {
			self.localStorage.setItem("mostra_deputados", newValue);
		},
		mostra_partidos: (newValue, oldValue) => {
			self.localStorage.setItem("mostra_partidos", newValue);
		}
	},

	computed: {
		votos() {
			return this.votacoes.
			map(v => {
				return {
					id: v.id,
					valor: v.valor
				};
			}).
			filter(v => v.valor != null);
		},
		candidatos() {
			list = this.votacoes.
			map(v => v.votacao).
			reduce(
				(all, v) => [
					...all,
					...v.map(vv => {
						return {
							id: vv.id,
							nome: vv.nome,
							foto: vv.foto,
							partido: vv.partido,
							siglaUf: vv.siglaUf
						};

					})
				],

				[]);

			return [...new Map(list.map(c => [c.id, c])).values()].filter(
				c => this.filtro_estado == "Todos" || c.siglaUf === this.filtro_estado);

		},
		partidos() {
			list = this.votacoes.
			filter(v => v.valor != null).
			map(v => v.votacao).
			reduce((all, v) => [...all, ...v.map(vv => vv.partido)], []);
			return list.filter((item, pos) => list.indexOf(item) == pos);
		},
		resultado_deputados() {
			return this.candidatos.map(c => {
				return {
					nome: c.nome,
					logo: c.foto,
					desc: c.partido + "-" + c.siglaUf,
					tipo: "deputado",
					total_votos: this.votacoes.filter(
					    (v) =>
					    v.valor != null &&
					    v.votacao.some((cc) => cc.id === c.id) &&
					    v.votacao.find((cc) => cc.id === c.id).voto === v.valor
					  ).length,
					nota: (
						10 *
						this.votacoes.filter(
							(v) =>
							v.valor != null &&
							v.votacao.some(cc => cc.id === c.id) &&
							v.votacao.find(cc => cc.id === c.id).voto === v.valor).length /
						this.votos.length).
					toFixed(1)
				};

			});
		},
		resultado_partidos() {
			votos_partido = this.partidos.map(p => {
				return {
					nome: p,
					votacoes: this.votacoes.map(v => {
						return {
							id: v.id,
							valor: v.valor,
							votos: v.votacao.filter(cc => cc.partido === p)
						};

					})
				};

			});

			votos_alinhados = votos_partido.map(p => {
				return {
					nome: p.nome,
					votacoes: p.votacoes.map(v => {
						return {
							id: v.id,
							valor: v.valor,
							votos: v.votos.filter(cc => cc.voto === v.valor)
						};

					})
				};

			});

			apuracao = this.partidos.map(p => {
				return {
					nome: p,
					tipo: "partido",
					total_votos: votos_partido.
					find(pp => pp.nome === p).
					votacoes.reduce(
						(add, pp) => add + (pp.valor != null ? pp.votos.length : 0),
						0),

					votos_alinhados: votos_alinhados.
					find(pp => pp.nome === p).
					votacoes.reduce(
						(add, pp) => add + (pp.valor != null ? pp.votos.length : 0),
						0)
				};


			});

			return apuracao.
			map(p => {
				return {
					nome: p.nome,
					desc: this.tabela_partidos.find(pp => pp.sigla === p.nome) ?
						this.tabela_partidos.find(pp => pp.sigla === p.nome).nome : "",
					logo: this.tabela_partidos.find(pp => pp.sigla === p.nome) ?
						this.tabela_partidos.find(pp => pp.sigla === p.nome).logo : "",
					total_votos: p.votos_alinhados,
					nota: (10 * (p.votos_alinhados / p.total_votos)).toFixed(1)
				};

			}).
			filter(p => p.nome != "S.PART.");
		},
		resultado() {
			return [].
			concat(
				this.mostra_partidos ? this.resultado_partidos : [],
				this.mostra_deputados ? this.resultado_deputados : []).

			sort((a, b) => b.nota - a.nota).
			filter((c, i) => c.nota >= 7.0 || i < 10);
		}
	},

	mounted() {
		cache = self.localStorage.getItem("votacoes");
		cache = JSON.parse(cache);
		if (cache != null)
			for (let vot of this.votacoes) {
				if (cache.find(v => v.id === vot.id))
					vot.valor = cache.find(v => v.id === vot.id).valor;
			}

		cache = self.localStorage.getItem("filtro_estado");
		if (cache != null) this.filtro_estado = cache;
		cache = JSON.parse(self.localStorage.getItem("mostra_deputados"));
		if (cache != null) this.mostra_deputados = cache;
		cache = JSON.parse(self.localStorage.getItem("mostra_partidos"));
		if (cache != null) this.mostra_partidos = cache;
		self.
		fetch(this.baseURL + "partidos?itens=1000").
		then(res => res.json()).
		then(res => {
			Promise.all(
				res.dados.map(p => self.fetch(p.uri).then(res => res.json()))).
			then(arr => {
				this.tabela_partidos = arr.map(p => {
					return {
						sigla: p.dados.sigla,
						nome: p.dados.nome,
						logo: p.dados.urlLogo.replace("http://", "https://")
					};

				});
			});
		}).
		catch(err => console.error(JSON.stringify(err)));
		Promise.all(
			this.votacoes.map((vot) =>
				self.fetch(this.baseURL + "votacoes/" + vot.id + "/votos").then(res => res.json()))).


		then(arr => {
			for (const [index, vot] of arr.entries())
				this.votacoes[index].votacao = vot.dados.map(v => {
					return {
						id: v.deputado_.id,
						nome: v.deputado_.nome,
						partido: v.deputado_.siglaPartido,
						siglaUf: v.deputado_.siglaUf,
						foto: v.deputado_.urlFoto.replace("http://", "https://"),
						voto: v.tipoVoto
					};

				});
		}).
		catch(err => console.error(JSON.stringify(err)));
	}
});


app.use(Quasar, {
	config: {}
});
app.mount("#q-app");
