const TechLeads = require("../Models/clientTechLeads");
const Managers = require("../Models/clientManagers");
const Client = require("../Models/client");

const controller = {
  /* TechLeads */
  createTechLeads: async (req, res, next) => {
    const { projectTechLeadName, projectTechLeadLastName, email, occupation, client } =
      req.body;

    if (!projectTechLeadName || !projectTechLeadLastName || !client)
      return res.status(302).json({ msg: "Complete all fields" });

    const newTechLead = new TechLeads({
      projectTechLeadName: projectTechLeadName,
      projectTechLeadLastName: projectTechLeadLastName,
      email: email,
      occupation: occupation,
      client:client,
      user: req.user.id,
    });
    await newTechLead
      .save()
      .then(() => {
        return res.json({ msg: "New techLead added" });
      })
      .catch(next);
  },
  updateTechLeads: async (req, res, next) => {
    const { projectTechLeadName, projectTechLeadLastName, email, occupation, client } =
      req.body;

    await TechLeads.findByIdAndUpdate(
      { _id: req.params.id },
      { projectTechLeadName, projectTechLeadLastName, email, occupation, client }
    )
      .then(() => {
        return res.json({ msg: "Tech lead updated" });
      })
      .catch(next);
  },
  deleteTechLeads: async (req, res, next) => {
    await TechLeads.findByIdAndRemove({ _id: req.params.id })
      .then(async () => {
        return res.json({ msg: "Tech Leads deleted" });
      })
      .catch(next);
  },
  getTechLeads: async (req, res, next) => {
    await TechLeads.find({ client: req.params.id })
      .lean()
      .populate([{ path: "user", model: "user" }])
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  },
  /* Managers */
  createManagers: async (req, res, next) => {
    const { clientManagerName, clientManagerLastName, email, client } = req.body;

    if (!clientManagerName || !clientManagerLastName || !client)
      return res.status(302).json({ msg: "Complete all fields" });

    const newManager = new Managers({
      clientManagerName: clientManagerName,
      clientManagerLastName: clientManagerLastName,
      client: client,
      email: email,
      user: req.user.id,
    });
    await newManager
      .save()
      .then(() => {
        return res.json({ msg: "New Manager added" });
      })
      .catch(next);
  },
  updateManagers: async (req, res, next) => {
    const { clientManagerName, clientManagerLastName, email, client } = req.body;

    await Managers.findByIdAndUpdate(
      { _id: req.params.id },
      { clientManagerName, clientManagerLastName, email, client }
    )
      .then(() => {
        return res.json({ msg: "Manager updated" });
      })
      .catch(next);
  },
  deleteManagers: async (req, res, next) => {
    await Managers.findByIdAndRemove({ _id: req.params.id })
      .then(async () => {
        return res.json({ msg: "Manager deleted" });
      })
      .catch(next);
  },
  getManagers: async (req, res, next) => {
    await Managers.find({ client: req.params.id })
      .lean()
      .populate([{ path: "user", model: "user" }])
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  },
  /* Clients */
  createClient: async (req, res, next) => {
    const { name } = req.body;

    if (!name )
      return res.status(302).json({ msg: "Complete all fields" });

    const newClient = new Client({
      name: name,
      user: req.user.id,
    });
    await newClient
      .save()
      .then(() => {
        return res.json({ msg: "New client added" });
      })
      .catch(next);
  },

  updateClient: async (req, res, next) => {
    const { name, client } = req.body;

    await Client.findByIdAndUpdate(
      { _id: req.params.id },
      { name, client}
    )
      .then(() => {
        return res.json({ msg: "Client updated" });
      })
      .catch(next);
  },

  deleteClient: async (req, res, next) => {
    await Client.findByIdAndRemove({ _id: req.params.id })
      .then(async () => {
        return res.json({ msg: "Client deleted" });
      })
      .catch(next);
  },
  getClient: async (req, res, next) => {
    await Client.find({ user: req.user.id }).then((result) => {
       res.json({result});
      })
      .catch(next);
  },
};

module.exports = controller;
