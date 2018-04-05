import _ from 'lodash';
import container from './dicontainer';

class RuleEngine  {

  constructor(){
    this.rules = [];
    this.triggers_map = {};

    this.container = container;
    this.postal = this.container.resolve('postal');
    var self = this;
    this.postal.subscribe({
      channel: 'device',
      topic: '#',
      callback: function(data,envelope){ self.processRules(data,envelope); }
    });

  }

  addRule(rule){
      var index = this.rules.push({name: rule.name,rule: rule}) - 1;
      let trigger = rule.getTrigger();
      this.triggers_map[trigger.name] = this.triggers_map[trigger.name] || [];
      this.triggers_map[trigger.name].push(_.extend({rule_index: index},trigger));
  }

  processRules(data,envelope)
  {
      let rules = this.triggers_map[envelope.topic];
      let self = this;
      _.forEach(rules,function(rule_trigger){
        let rule = self.rules[rule_trigger.rule_index];
        rule.rule.process(container, data);
      })
  }
};

export default RuleEngine;
