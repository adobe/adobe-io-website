/* eslint-disable */
var LOCAL_STORAGE_KEY = 'unified-decisioning-experiments';
function assignTreatment(allocationPercentages, treatments) {
  var random = Math.random() * 100;
  var i = treatments.length;
  while (random > 0 && i > 0) {
      i -= 1;
      random -= +allocationPercentages[i];
  }
  return treatments[i];
}
function getLastExperimentTreatment(experimentId) {
  var experimentsStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (experimentsStr) {
      var experiments = JSON.parse(experimentsStr);
      if (experiments[experimentId]) {
          return experiments[experimentId].treatment;
      }
  }
  return null;
}
function setLastExperimentTreatment(experimentId, treatment) {
  var experimentsStr = localStorage.getItem(LOCAL_STORAGE_KEY);
  var experiments = experimentsStr ? JSON.parse(experimentsStr) : {};
  var now = new Date();
  var expKeys = Object.keys(experiments);
  expKeys.forEach(function (key) {
      var date = new Date(experiments[key].date);
      if ((now.getTime() - date.getTime()) > (1000 * 86400 * 30)) {
          delete experiments[key];
      }
  });
  var date = now.toISOString().split('T')[0];
  experiments[experimentId] = { treatment: treatment, date: date };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(experiments));
}
function assignTreatmentByDevice(experimentId, allocationPercentages, treatments) {
  var cachedTreatmentId = getLastExperimentTreatment(experimentId);
  var treatmentIdResponse;
  if (!cachedTreatmentId) {
      var assignedTreatmentId = assignTreatment(allocationPercentages, treatments);
      setLastExperimentTreatment(experimentId, assignedTreatmentId);
      treatmentIdResponse = assignedTreatmentId;
  }
  else {
      treatmentIdResponse = cachedTreatmentId;
  }
  return {
      treatmentId: treatmentIdResponse
  };
}

var RandomizationUnit = {
  VISITOR: 'VISITOR',
  DEVICE: 'DEVICE'
};
function evaluateExperiment(context, experiment) {
  var experimentId = experiment.id, identityNamespace = experiment.identityNamespace, _a = experiment.randomizationUnit, randomizationUnit = _a === void 0 ? RandomizationUnit.VISITOR : _a;
  var identityMap = context.identityMap;
  var treatments = experiment.treatments.map(function (item) { return item.id; });
  var allocationPercentages = experiment.treatments.map(function (item) { return item.allocationPercentage; });
  var treatmentAssignment = null;
  switch (randomizationUnit) {
      case RandomizationUnit.DEVICE: {
          treatmentAssignment = assignTreatmentByDevice(experimentId, allocationPercentages, treatments);
          break;
      }
      default:
          throw new Error("Unknow randomization unit");
  }
  var evaluationResponse = {
      experimentId: experimentId,
      hashedBucket: treatmentAssignment.bucketId,
      treatment: {
          id: treatmentAssignment.treatmentId
      }
  };
  return evaluationResponse;
}

function traverseDecisionTree(decisionNodesMap, context, currentNodeId) {
  var _a = decisionNodesMap[currentNodeId], experiment = _a.experiment, type = _a.type;
  if (type === 'EXPERIMENTATION') {
      var treatment = evaluateExperiment(context, experiment).treatment;
      return [treatment];
  }
}

function evaluateDecisionPolicy(decisionPolicy, context) {
  var decisionNodesMap = {};
  decisionPolicy.decisionNodes.forEach(function (item) {
      decisionNodesMap[item['id']] = item;
  });
  var items = traverseDecisionTree(decisionNodesMap, context, decisionPolicy.rootDecisionNodeId);
  return {
      items: items
  };
}

export { evaluateDecisionPolicy };
