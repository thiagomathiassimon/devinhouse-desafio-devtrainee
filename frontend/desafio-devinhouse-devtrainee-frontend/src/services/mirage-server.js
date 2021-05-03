import { exames, agendamentos, pacientes } from "../util/constantes";
import { createServer, Model } from "miragejs";
//import * as baseendpoints from "./baseendpoints";

let patientCounter = pacientes.length;
let schedeludedExamsCounter = agendamentos.length;

export function criarServidor({ environment = "test" } = {}) {
  const server = createServer({
    environment,
    models: {
      exame: Model,
      agendamento: Model,
      paciente: Model,
    },

    seeds(server) {
      exames.forEach((exame) => server.create("exame", exame));
      agendamentos.forEach((agendamento) =>
        server.create("agendamento", agendamento)
      );
      pacientes.forEach((paciente) => server.create("paciente", paciente));
    },

    routes() {
      this.namespace = "";

      this.get("/exames", (schema, request) => {
        console.log("schema", schema);
        return schema.exames.all().models;
      });

      this.get("/agendamento/listar", (schema, request) => {
        return schema.agendamentos.all().models;
      });

      this.post("/agendamento/cadastrar", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = schedeludedExamsCounter;
        schedeludedExamsCounter++;
        console.log("attrs", attrs);
        return schema.agendamentos.create(attrs);
      });

      this.delete("/agendamento/:id", (schema, request) => {
        const id = request.params.id;
        return schema.agendamentos.find(id).destroy();
      });

      this.get("/paciente/listar", (schema, request) => {
        const cpf = request.queryParams.cpf;
        console.log("cpf", cpf);
        if (cpf !== undefined) {
          console.log("requisição de busca com parâmetros");
          return schema.pacientes.where((paciente) =>
            paciente.patientCpf.includes(cpf)
          ).models;
        }
        return schema.pacientes.all().models;
      });

      this.post("/paciente/cadastrar", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = patientCounter;
        patientCounter++;
        console.log("attrs", attrs);
        return schema.pacientes.create(attrs);
      });

      this.delete("/paciente/:id", (schema, request) => {
        const id = request.params.id;
        return schema.pacientes.find(id).destroy();
      });

      /*
      this.get("/processo", (schema, request) => {
        const q = request.queryParams.q;
        console.log("q", q);
        if (q) {
          console.log("requisição de busca com parâmetros");
          return schema.processos.where(
            (processo) =>
              processo.numero.includes(q) ||
              processo.assunto.includes(q) ||
              processo.interessados.includes(q) ||
              processo.descricao.includes(q)
          ).models;
        }
        console.log("schema", schema);
        return schema.processos.all().models;
      });

      this.get("/processo/:id", (schema, request) => {
        const id = request.params.id;
        return schema.processos.find(id).attrs;
      });

      this.post("/processo", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        attrs.id = contador;
        console.log("attrs", attrs);
        return schema.processos.create(attrs);
      });

      this.put("/processo", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.processos.create(attrs);
      });

      this.delete("/processo/:id", (schema, request) => {
        const id = request.params.id;
        return schema.processos.find(id).destroy();
      });

     */
    },
  });

  return server;
}
