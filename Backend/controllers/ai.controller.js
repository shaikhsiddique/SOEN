import * as ai from '../services/ai.service.js'


export const getResult = async (req,res)=>{
    const { prompt } = req.query;
    try {
        const result = await ai.generateResult(prompt);
        // res.status(200).json({message:result});
        res.send(result)
    } catch (error) {
        res.status(500).json({error: 'An error occurred while generating the result.'});
    }
}