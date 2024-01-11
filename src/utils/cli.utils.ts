import type { DistinctQuestion } from 'inquirer'
import inquirer from 'inquirer'

export const promptAndValidateParams = async <Params extends { [name: string]: string }>(
  partialParamValues: Partial<Params>,
  questions: { [Name in keyof Params]: Omit<DistinctQuestion, 'when'|'name'> },
): Promise<Params> => {
  const when = (name: keyof Params) => async () => {
    if (!partialParamValues[name]) {
      // TODO: include `question[key].when` in the evaluation
      return true;
    }
    if (!questions[name].validate) {
      return false;
    }
    const validation = await questions[name].validate(partialParamValues[name]);
    if (typeof validation !== 'boolean') {
      throw new Error(validation);
    }
  }

  const fullQuestions = Object.entries(questions).map(([name, value]) => ({
    ...value,
    name,
    when: when(name),
  }));
  const answers = await inquirer.prompt(fullQuestions);
  return Object.assign({}, partialParamValues, answers);
}
